import { Observable, merge, Subject, Notification, of, timer, forkJoin, combineLatest, queueScheduler, BehaviorSubject, EMPTY, concat } from 'rxjs';
import { delay, first, map, mapTo, materialize, switchMap, takeWhile, tap, scan, startWith, filter, withLatestFrom, share, mergeMap, mergeScan     } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, OnInit, TemplateRef, ViewContainerRef              } from '@angular/core';

import { Destroyable                                     } from '../../destroyable/destroyable';
import { ObserverName, DurationAnnotation, DurationUnit, TimeBreakdown } from '../abstraction/types/general';
import { OnObserverContext                               } from './types/on-observer-context';

const StateNotificationMap: Record<'N' | 'E' | 'C', ObserverName> = {
    N: 'next',
    E: 'error',
    C: 'complete'
};

const DurationMultipliers: Record<DurationUnit, number> = { ms: 1, s: 1000, m: 60000 };

const DefaultDurationIntervalDivisor = 30;

function durationToMs(duration: DurationAnnotation): number
{
    if (typeof duration === 'number') return duration;

    const regex = /(?<value>\d+)(?<units>\w+)/;
    
    const { value, units } = duration.match(regex)?.groups as { value: string, units: DurationUnit };

    return parseInt(value) * (DurationMultipliers[units] || 1);
}

class ObserverCall<T>
{
    public readonly timestamp = Date.now();
    
    constructor(
        public readonly name  : ObserverName,
        public readonly value?: T,
    ) { }
    
    public static resolving<T>(): ObserverCall<T>
    {
        return new ObserverCall<T>('resolving');
    }
    
    public static fromNotification<T>({ kind, value, error }: Notification<T>): ObserverCall<T>
    {
        return new ObserverCall(StateNotificationMap[kind], error || value);
    }
}

class ViewRenderState<T>
{
    constructor(
        public readonly commitmentId         : number,
        public readonly call                 : ObserverCall<T>,
        public readonly view                 : RenderedView<T> | null,
        public readonly delayStartTimestamp  : number,
        public readonly countdownEndTimestamp: number,
    ) { }

    public get isRendered(): boolean { return !!this.view; }

    static create<T>(call: ObserverCall<T>, showAfter: number, showFor: number): ViewRenderState<T>
    {
        const now = Date.now();
        
        return new ViewRenderState(now, call, null, now, now + showAfter + showFor);
    }

    static update<T>(state: ViewRenderState<T>, call: ObserverCall<T>, showAfter: number, showFor: number): ViewRenderState<T>
    {
        return new ViewRenderState(state.commitmentId, call, state.view, state.delayStartTimestamp, state.delayStartTimestamp + showAfter + showFor);
    }
    
    static rendered<T>(state: ViewRenderState<T>, view: RenderedView<T>): ViewRenderState<T>
    {
        return new ViewRenderState(state.commitmentId, state.call, view, state.delayStartTimestamp, state.delayStartTimestamp);
    }
}

type RenderedView<T> = EmbeddedViewRef<OnObserverContext<T>>;

type ViewStateMap<T> = { [commitmentId in number | 'main']: ViewRenderState<T> };

type ViewMode = 'multiple' | 'single';

@Directive()
export abstract class OnObserverBaseDirective<T> extends Destroyable implements OnInit
{
    private states: ViewStateMap<T> = { } as ViewStateMap<T>;

    protected abstract readonly selector: string;
    protected abstract renderOnCallsTo  : ObserverName | ObserverName[];
    
    protected viewMode           : ViewMode           = 'single';
    protected showAfter          : DurationAnnotation = 0;
    protected showFor?           : DurationAnnotation;
    protected countdownPrecision?: DurationAnnotation;
    
    /**
     * ### Why BehaviorSubject<... | null> and not Subject<...>
     * `input` is set from @Input properties. For some reason, Angular passes-in the first value BEFORE
     * ngOnInit, even though other @Input properties (e.g. showAfter, showFor) are passed AFTER ngOnInit.
     * If subscription occurs in the constructor, `input` will emit the first observable too fast, which
     * might lead to pipes breaking or misbehaving if they rely on properties to be instantiated first.
     * 
     * This leads to subscribing in ngOnInit, to allow Angular time to initialize those.
     * BUT, if `input` is a Subject, as the first value was already emitted BEFORE ngOnInit, it will not be
     * captured by our subscription to `input`. Hence the BehaviorSubject - To allow capturing that first observable.
     */
    protected readonly input: BehaviorSubject<Observable<T> | null> = new BehaviorSubject(null as Observable<T> | null);

    public get isSingleView(): boolean { return this.viewMode === 'single'  ; }
    public get isMultiView (): boolean { return this.viewMode === 'multiple'; }

    constructor(private readonly template: TemplateRef<OnObserverContext<T>>, private readonly viewContainer: ViewContainerRef)
    {
        super();
    }
    
    ngOnInit(): void
    {
        // See `this.input` documentation for why subscription is done in ngOnInit.
        this.subscribe(this.stateFeed());
    }

    private destroyAll(states: ViewStateMap<T>): void
    {
        Object.keys(states).forEach(commitmentId =>
        {
            const { view } = states[commitmentId as number | 'main'];

            if (view) this.destroyView(view);
        });
    }

    private stateFeed()//: Observable<void>
    {
        return this.input.pipe(
            // tap      (()         => console.log(`New input detected. Performing cleanup...`)),
            tap(() => this.destroyAll(this.states)),
            switchMap(input => input ? this.observeInput(input) : EMPTY),
            map(call =>
            {
                console.log(`[--------Flow---------] Received call: ${ call.name } - ${ call.value }`);

                if (this.shouldRender(call))
                {
                    console.log(`[--------Flow---------] Should render. Should this be a single view?`);

                    const showAfter = durationToMs(this.showAfter);
                    const showFor   = durationToMs(this.showFor || 0);

                    if (this.isSingleView)
                    {
                        console.log(`[--------Flow---------] Yes. ${this.alreadyRendered ? 'Already rendered. Updating state...' : 'Nothing rendered. Creating new state...'}`);

                        const newState = this.alreadyRendered
                            ? ViewRenderState.update(this.states.main, call, showAfter, showFor)
                            : ViewRenderState.create(call, showAfter, showFor);
                        
                        return { main: newState };
                    }
                    else
                    {
                        console.log(`[--------Flow---------] No. Generating new state...`);

                        const newState = ViewRenderState.create(call, showAfter, showFor);

                        console.log(`[--------Flow---------] Adding new state. This will be #${ Object.keys(this.states).length + 1 }`);

                        return { ...this.states, [newState.commitmentId]: newState };
                    }
                }
                else
                {
                    console.log(`[--------Flow---------] Shouldn't render. Using existing ${ Object.keys(this.states).length } states`);

                    if (this.showFor) return this.states;

                    return {} as ViewStateMap<T>;
                }
            }),
            switchMap(states => this.onStatesChanged(states)),
        );
    }

    private observeInput(input: Observable<T>): Observable<ObserverCall<T>>
    {
        return input.pipe(
            materialize(),
            map        (ObserverCall.fromNotification),
            startWith  (ObserverCall.resolving<T>())
        );
    }

    private onStatesChanged(states: ViewStateMap<T>): Observable<void[]>
    {
        this.states = states;

        console.log(`[onStateChanged] Committing to render ${ Object.keys(states).length } states...`);

        const commitToRender = (id: 'main' | number) =>
        {
            const state = states[id];

            return this.delayRender(state).pipe(
                switchMap(state         => this.renderState(state)),
                tap      (renderedState => states[id] = renderedState),
                switchMap(renderedState => this.autoDestroy(renderedState)),
                tap      (()            => delete states[id])
            );
        };
            
        const renderCommitments = Object.keys(states).map(commitmentId => commitToRender(commitmentId as 'main' | number));
            
        return forkJoin(renderCommitments);
    }

    private shouldRender({ name }: ObserverCall<T>): boolean
    {
        const observeOn = Array.isArray(this.renderOnCallsTo) ? this.renderOnCallsTo : [this.renderOnCallsTo];
        
        return observeOn.includes(name);
    }

    private get alreadyRendered(): boolean
    {
        return Object.keys(this.states).some(commitmentId => this.states[commitmentId as number | 'main'].isRendered);
    }

    private commitToRender(state: ViewRenderState<T>): Observable<void>
    {
        return this.delayRender(state).pipe(
            switchMap(state         => this.renderState(state)),
            switchMap(renderedState => this.autoDestroy(renderedState)),
        );
    }

    private delayRender(state: ViewRenderState<T>): Observable<ViewRenderState<T>>
    {
        const renderDelay = durationToMs(this.showAfter);
        const delayPassed = Date.now() - state.delayStartTimestamp;
        const delayLeft   = renderDelay > delayPassed ? renderDelay - delayPassed : 0; // Avoid negative delay
        
        return of(state).pipe(
            // Because by default delay() runs on asyncScheduler, concurrency issues happen between render and destroy
            // causing the view to stay rendered. Executing delay() on queueScheduler causes the timer not to wait
            // for the next event loop, thus keeping synchronous code execution order and logic.
            delay(delayLeft, queueScheduler),
            mapTo(state)
        );
    }

    private renderState(state: ViewRenderState<T>): Observable<ViewRenderState<T>>
    {    
        return of(this.createViewContext(state)).pipe(            
            map(context => this.renderOrUpdateView(state, context)),
        );
    }

    private autoDestroy({ view, countdownEndTimestamp: countdownStartTimestamp }: ViewRenderState<T>)
    {
        if (!view)
        {
            console.warn(`[autoDestroy] Trying to auto destroy non rendered view: ${ view }`);

            return EMPTY;
        }

        const showForMs            = durationToMs(this.showFor || 0);
        const countdownPrecisionMs = this.defineCountdownPrecisionInterval();
        
        // Enclosing Date.now() in an observable ensures it is called when the observable is
        // actually subscribed to and not during the setup stage inside autoDestroy().
        const startTime = of(void 0).pipe(map(() => countdownStartTimestamp));

        return combineLatest([startTime, timer(0, countdownPrecisionMs)]).pipe(
            map(([startTime]) => Date.now() - startTime),
            map(timePassedMs => showForMs - timePassedMs),
            map(timeLeftMs       => timeLeftMs < 0 ? 0 : timeLeftMs),
            tap(timeLeftMs       => console.log(`[autoDestroy] Time left to destroy: ${timeLeftMs}ms. Updating countdown...`)),
            tap(timeLeftMs       => this.updateViewContextShowFor(view, timeLeftMs)),
            takeWhile(timeLeftMs => timeLeftMs > 0, true),
            filter(timeLeftMs    => timeLeftMs <= 0),
            tap(() => console.log(`[autoDestroy] destroying...`)),
            map(() => this.destroyView(view))
        );
    }

    private renderOrUpdateView(state: ViewRenderState<T>, context: OnObserverContext<T>): ViewRenderState<T>
    {
        console.log(`[renderOrUpdateView] ${ state.view ? 'View renderd. Updating context...' : 'Rendering view...' }`);

        if (state.view)
        {
            state.view.context = context;
            
            return state;
        }
        
        const view = this.viewContainer.createEmbeddedView(this.template, context);

        return ViewRenderState.rendered(state, view);
    }

    private destroyView(view: RenderedView<T>): void
    {
        view.destroy();
    }

    private createViewContext({ call: { name, value } }: ViewRenderState<T>): OnObserverContext<T>
    {
        console.log('[createViewContext] creating context...');
        return new OnObserverContext(this.selector, name, value);
    }

    private updateViewContext(view: RenderedView<T>, context: OnObserverContext<T>): void
    {
        view.context = context;
    }

    private updateViewContextShowFor(view: RenderedView<T>, showingForMs: number): void
    {    
        console.log(`[updateViewContextShowFor] view exists. updating countdown in context...`);
        const dummyDate = new Date(showingForMs);

        const showingFor: TimeBreakdown = {
            m                : dummyDate.getMinutes(),
            s                : dummyDate.getSeconds(),
            ms               : dummyDate.getMilliseconds(),
            totalMinutes     : showingForMs / DurationMultipliers.m,
            totalSeconds     : showingForMs / DurationMultipliers.s,
            totalMilliseconds: showingForMs,
        };

        const { $implicit, lastCall: lastState } = view.context;

        this.updateViewContext(view, new OnObserverContext(this.selector, lastState, $implicit, showingFor));
    }

    private defineCountdownPrecisionInterval(): number
    {
        // If the view should persist, or it should auto-destroy but percision has been manually specified, do nothing
        if (!this.showFor) throw new Error(`
            Auto-destroy countdown seems to have been initiated when 'showFor' hasn't been set. This shouldn't have happend.
            Please consider filing an issue and providing a stack trace here: https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+
        `);
        
        if (this.countdownPrecision) return durationToMs(this.countdownPrecision);

        const showForMs = durationToMs(this.showFor);

        return showForMs / DefaultDurationIntervalDivisor;
    }
}

// ------------- single ----------------
// if commited to render

//     recreate obs using timestamp of now for countdown

//     provide auto destroy anyway

// else

//      if should render

//          render

//      else if rendered and not commited to destroy

//          destroy
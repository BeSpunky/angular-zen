import { Observable, Subject, Notification, of, timer, forkJoin, combineLatest, queueScheduler, BehaviorSubject, EMPTY } from 'rxjs';
import { delay, first, map, mapTo, materialize, switchMap, takeWhile, tap, scan, startWith, filter, withLatestFrom     } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, OnInit, TemplateRef, ViewContainerRef              } from '@angular/core';

import { Destroyable                                     } from '../../destroyable/destroyable';
import { ObserverState, DurationAnnotation, DurationUnit, TimeBreakdown } from '../abstraction/types/general';
import { OnObserverContext                               } from './types/on-observer-context';

const StateNotificationMap: Record<'N' | 'E' | 'C', ObserverState> = {
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

class StateData<T>
{
    constructor(
        public readonly name      : ObserverState,
        public readonly value?    : T,
        public readonly enteredOn?: number
    ) { }

    public static Initial: StateData<unknown> = new StateData('resolving');

    public static fromNotification<T>({ kind, value, error }: Notification<T>): StateData<T>
    {
        return new StateData(StateNotificationMap[kind], error || value);
    }

    public static next<T>(previous: StateData<T>, current: StateData<T>): StateData<T>
    {
        const enteredOn = current.name === previous.name ? previous.enteredOn : Date.now();

        return { ...current, enteredOn };
    }
}

@Directive()
export abstract class OnObserverBaseDirective<T> extends Destroyable implements OnInit
{
    protected abstract readonly selector: string;
    protected abstract renderOnCallsTo  : ObserverState | ObserverState[];
    
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
    
    private view: EmbeddedViewRef<OnObserverContext<T>> | null = null;
    
    constructor(private readonly template: TemplateRef<OnObserverContext<T>>, private readonly viewContainer: ViewContainerRef)
    {
        super();
    }
    
    ngOnInit(): void
    {
        // See `this.input` documentation for why subscription is done in ngOnInit.
        this.subscribe(this.stateFeed());
    }

    private stateFeed()//: Observable<void>
    {
        return this.input.pipe(
            tap(() => console.log(`New input detected. Performing cleanup...`)),
            tap(() => this.destroyView()),
            switchMap(input => input ? this.observeInput(input) : EMPTY)
        );
    }

    private observeInput(input: Observable<T>)//: Observable<void>
    {
        const initialState = StateData.Initial as StateData<T>;

        return input.pipe(
            materialize(),
            map        (StateData.fromNotification),
            startWith  (initialState),
            tap        (console.log),
            scan       ((previous, current) => StateData.next(previous, current), initialState),
            switchMap  (state               => this.handleState(state))
        );
    }

    private handleState(state: StateData<T>): Observable<void>
    {
        console.log(`[updateState] Updating state...`);
        console.log(`[updateState] Should render: ${this.shouldRender(state.name)}`);
        console.log(`[updateState] Destroy countdown initiated: ${this.destroyCountdownInitiated}`);

        this.shouldRender(state.name) ? console.log('[updateState] triggering render or update...') :
            this.destroyCountdownInitiated ? console.log('[updateState] skipping state update') : console.log('[updateState] destroying view...');

        return this.shouldRender(state.name) ? this.renderOrUpdateView(state) :
                 this.destroyCountdownInitiated ? this.autoDestroy() : of(this.destroyView());

        // this.shouldRender(state.name) ? console.log('[updateState] triggering render or update...') : console.log('[updateState] destroying view...');

        // return this.shouldRender(state.name) ? this.renderOrUpdateView(state) : this.destroyView();
    }

    private shouldRender(state: ObserverState): boolean
    {
        const observeOn = Array.isArray(this.renderOnCallsTo) ? this.renderOnCallsTo : [this.renderOnCallsTo];
        
        return observeOn.includes(state);
    }

    private renderOrUpdateView(state: StateData<T>): Observable<void>
    {
        const context = this.createViewContext(state);
        
        if (this.view) console.log('[renderOrUpdateView] view exists. updating context...', context);

        if (this.view) return of(this.updateViewContext(context));

        console.log(`[renderOrUpdateView] view doesn't exist. initiating render flow...`);

        const renderDelay = durationToMs(this.showAfter);
        const delayPassed = state.enteredOn ? Date.now() - state.enteredOn : 0;
        const delayLeft   = renderDelay - delayPassed;

        console.log(`[renderOrUpdateView] showAfter: ${ this.showAfter }, delayPassed: ${ delayPassed }, delayLeft: ${ delayLeft }`);

        return of(void 0).pipe(
            // Because by default delay() runs on asyncScheduler, concurrency issues happen between render and destroy
            // causing the view to stay rendered. Executing delay() on queueScheduler causes the timer not to wait
            // for the next event loop, thus keeping synchronous code execution order and logic.
            tap      (() => console.log(`[renderOrUpdateView] delaying render in ${delayLeft}ms`)),
            delay    (delayLeft, queueScheduler),
            tap      (() => console.log(`[renderOrUpdateView] rendering...`)),
            tap      (() => this.renderView(context)),
            tap      (() => console.log(this.showFor ? `[renderOrUpdateView] initiating auto destroy flow...` : '[renderOrUpdateView] skipping auto destroy.')),
            switchMap(() => this.showFor ? this.autoDestroy() : of(void 0))
        );
    }

    private autoDestroy(): Observable<void>
    {
        const showForMs = this.destroyCountdownInitiated
                            ? this.view?.context.showingFor?.totalMilliseconds ?? 0
                            : durationToMs(this.showFor ?? 0);

        const countdownPrecisionMs = this.defineCountdownPrecisionInterval();
        
        // Enclosing Date.now() in an observable ensures it is called when the observable is
        // actually subscribed to and not during the setup stage inside autoDestroy().
        const startTime = of(void 0).pipe(map(() => Date.now()));

        return combineLatest([startTime, timer(0, countdownPrecisionMs)]).pipe(
            map(([startTime])    => Date.now() - startTime),
            map(timePassedMs     => showForMs - timePassedMs),
            map(timeLeftMs       => timeLeftMs < 0 ? 0 : timeLeftMs),
            tap(timeLeftMs       => console.log(`[autoDestroy] Time left to destroy: ${timeLeftMs}ms. Updating countdown...`)),
            tap(timeLeftMs       => this.updateViewContextShowFor(timeLeftMs)),
            takeWhile(timeLeftMs => timeLeftMs > 0),
            filter(timeLeftMs => timeLeftMs <= 0),
            tap(() => console.log(`[autoDestroy] destroying...`)),
            map(() => this.destroyView())
        );
    }

    private renderView(context: OnObserverContext<T>): void
    {
        if (this.view) throw new Error(`
            Cannot render view for *${ this.selector }. Expected view not to exists but is alreay rendered.
            Please consider reporting the problem here: https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+
            Attempted context: ${JSON.stringify(context)}
        `);

        this.view = this.viewContainer.createEmbeddedView(this.template, context);
    }

    private destroyView(): void
    {
        console.log(`[destroyView] view exists: ${!!this.view}. ${this.view ? 'destroying' : 'skipping destroy'}.`)
        
        if (this.view)
        {
            this.view.destroy();
            this.view = null;
        }
    }

    private createViewContext({ name, value }: StateData<T>): OnObserverContext<T>
    {
        console.log('[createViewContext] creating context...');
        return new OnObserverContext(this.selector, name, value);
    }

    private updateViewContext(context: OnObserverContext<T>): void
    {
        if (!this.view) throw new Error(`
            Cannot update view context for *${ this.selector }. Expected view to be rendered but it is ${ this.view }.
            Please consider reporting the problem here: https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+
            Attempted context update: ${JSON.stringify(context)}
        `);

        this.view.context = context;
    }

    private updateViewContextShowFor(showingForMs: number): void
    {
        if (!this.view) console.log(`[updateViewContextShowFor] view doesn't exist. skipping countdown update.`)
        if (!this.view) return;
        
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

        const { $implicit, lastState } = this.view.context;

        this.updateViewContext(new OnObserverContext(this.selector, lastState, $implicit, showingFor));
    }

    private get destroyCountdownInitiated(): boolean
    {
        return !!this.view?.context.showingFor;
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

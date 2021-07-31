import { Observable, of, timer, forkJoin, BehaviorSubject, EMPTY                                } from 'rxjs';
import { delay, finalize, map, mapTo, materialize, switchMap, takeWhile, tap, startWith, filter } from 'rxjs/operators';
import { Directive, OnInit, TemplateRef, ViewContainerRef                                       } from '@angular/core';

import { Destroyable                                                                            } from '../../destroyable/destroyable';
import { ObserverName, DurationAnnotation, ViewStateMap, ViewMode, RenderedView                 } from '../abstraction/types/general';
import { OnObserverContext                                                                      } from './types/on-observer-context';
import { ObserverCall                                                                           } from './types/observer-call';
import { ViewRenderState                                                                        } from './types/view-render-state';
import { breakdownTime, durationToMs                                                            } from '../utils/time-utils';

const DefaultDurationIntervalDivisor = 30;

@Directive()
export abstract class OnObserverBaseDirective<T> extends Destroyable implements OnInit
{
    private states: ViewStateMap<T> = new Map();

    private get mainState(): ViewRenderState<T> { return this.states.values().next().value };

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
    
    ngOnInit()
    {
        // See `this.input` documentation for why subscription is done in ngOnInit.
        this.subscribe(this.renderFeed());
    }

    private destroyAll(): void
    {
        this.states.forEach(({ view }) => view?.destroy());
    }

    private renderFeed(): Observable<void[]>
    {
        return this.input.pipe(
            tap      (()     => this.destroyAll()),
            finalize (()     => this.destroyAll()),
            switchMap(input  => input ? this.observeInput(input) : EMPTY),
            map      (call   => this.shouldRender(call) ? this.aggregateStates(call) : this.deaggregateStates()),
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

    private shouldRender({ name }: ObserverCall<T>): boolean
    {
        const observeOn = Array.isArray(this.renderOnCallsTo) ? this.renderOnCallsTo : [this.renderOnCallsTo];
        
        return observeOn.includes(name);
    }

    private get alreadyRendered(): boolean
    {
        return Array.from(this.states.values()).some(state => state.isRendered);
    }
    
    private aggregateStates(call: ObserverCall<T>): ViewStateMap<T>
    {
        const states   = this.states;
        const newState = this.isSingleView && this.alreadyRendered
            ? ViewRenderState.update(this.mainState, call)
            : ViewRenderState.create(call, durationToMs(this.showAfter), durationToMs(this.showFor || 0));

        return new Map(states.set(newState.commitmentId, newState));
    }

    private deaggregateStates(): ViewStateMap<T>
    {
        return this.showFor ? new Map(this.states) : new Map();
    }
    
    private onStatesChanged(states: ViewStateMap<T>): Observable<void[]>
    {
        if (!states.size) this.destroyAll();

        this.states = states;

        const commitments = Array.from(states.keys())
                                 .map((commitmentId, index) => this.commitToRender(states, commitmentId, index));
            
        return forkJoin(commitments);
    }
    
    private commitToRender(states: ViewStateMap<T>, commitmentId: string, index: number): Observable<void>
    {
        if (!states.has(commitmentId)) throw new Error(`
            *${ this.selector } has encountered an inconsistency issue. Tried to commit to rendering state with ID ${ commitmentId }, but no state object exists with that ID.
            Please consider filing an issue and providing a stack trace here: https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+
        `);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return of(states.get(commitmentId)!).pipe(
            switchMap(state         => this.delayRender(state)),
            switchMap(state         => this.renderState(state, index)),
            tap      (renderedState => states.set(commitmentId, renderedState)),
            switchMap(renderedState => this.autoDestroy(renderedState)),
            tap      (()            => states.delete(commitmentId))
        );
    }

    private delayRender(state: ViewRenderState<T>): Observable<ViewRenderState<T>>
    {
        return of(state).pipe(
            delay(new Date(state.renderAt)),
            mapTo(state)
        );
    }

    private renderState(state: ViewRenderState<T>, index: number): Observable<ViewRenderState<T>>
    {    
        return of(OnObserverContext.fromState<T>(this.selector, index, state)).pipe(            
            map(context => this.renderOrUpdateView(state, context)),
        );
    }

    private autoDestroy({ destroyAt, showFor, view }: ViewRenderState<T>)
    {
        if (!(showFor && view)) return EMPTY;

        const countdownPrecisionMs = this.defineCountdownPrecision();
        
        return timer(0, countdownPrecisionMs).pipe(
            map      (()         => destroyAt - Date.now()),
            map      (timeLeftMs => timeLeftMs < 0 ? 0 : timeLeftMs),
            tap      (timeLeftMs => this.updateViewContextShowFor(view, timeLeftMs)),
            takeWhile(timeLeftMs => timeLeftMs > 0, true),
            filter   (timeLeftMs => timeLeftMs <= 0),
            map      (()         => view.destroy())
        );
    }

    private renderOrUpdateView(state: ViewRenderState<T>, context: OnObserverContext<T>): ViewRenderState<T>
    {
        if (state.view)
        {
            state.view.context = context;
            
            return ViewRenderState.rendered(state, state.view);
        }
        
        return ViewRenderState.rendered(state, this.viewContainer.createEmbeddedView(this.template, context));
    }

    private updateViewContextShowFor(view: RenderedView<T>, showingForMs: number): void
    {    
        const showingFor = breakdownTime(showingForMs);

        const { $implicit, lastCall, index } = view.context;

        view.context = new OnObserverContext(this.selector, index, lastCall, $implicit, showingFor);
    }

    private defineCountdownPrecision(): number
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

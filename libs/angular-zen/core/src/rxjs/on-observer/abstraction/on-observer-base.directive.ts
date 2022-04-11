import { Observable, of, timer, forkJoin, BehaviorSubject, EMPTY                                } from 'rxjs';
import { delay, finalize, map, mapTo, materialize, switchMap, takeWhile, tap, startWith, filter } from 'rxjs/operators';
import { Directive, OnInit, TemplateRef, ViewContainerRef                                       } from '@angular/core';

import { Destroyable                                                                            } from '../../destroyable/destroyable';
import { ObserverName, DurationAnnotation, RenderCommitmentMap, ViewMode, RenderedView          } from '../abstraction/types/general';
import { breakdownTime, durationToMs                                                            } from '../utils/time-utils';
import { OnObserverContext                                                                      } from './types/on-observer-context';
import { ObserverCall                                                                           } from './types/observer-call';
import { ViewRenderCommitment                                                                   } from './types/view-render-commitment';

/**
 * The default number of times the countdown will be updated in a rendered view waiting to be auto-destroyed.
 * To change this, the user will have to specify a value for the {@link OnObserverBaseDirective.countdownInterval `countdownInterval`} property.
 **/
const DefaultCountdownUpdateCount = 30;

/**
 * Provides functionality for `*onObserver<state>` directives that render templates according to the state of an observable.
 * 
 * Any template assigned with the directive will render when the defined observer calls are intercepted, and destroyed when any other calls are
 * intercepted. For example, if the directive intercepts `next` calls, the view will render on the first value emission, then destroy on
 * `complete` or `error`.
 * 
 * ## Features
 * 
 * #### View Context
 * Use the microsyntax `as` keyword to assign resolved values to a variable.
 * Use the microsyntax `let` keyword to assign the {@link OnObserverContext full context object} to a variable (e.g. `let context`).
 *  
 * #### Delayed rendering
 * Specify a value for {@link OnObserverBaseDirective.showAfter `showAfter`} to delay rendering.
 * 
 * #### Auto destroy
 * Specify {@link OnObserverBaseDirective.showFor `showFor`} to automatically destroy the view after a certain duration.
 * 
 * #### Countdown udpates
 * When {@link OnObserverBaseDirective.showFor `showFor`} is specified, the view context will be updated in fixed intervals with the
 * amount of time left until the view is destroyed. This allows giving the user feedback in a progress bar, a spinner, a textual timer
 * or any other UI component. 
 * 
 * Countdown is provided by the {@link OnObserverContext.showingFor `showingFor`} property. Access it by assigning a variable using `let`, like so:
 * `let remaining = showingFor`
 * 
 * #### Multi view mode
 * Specify {@link OnObserverBaseDirective.viewMode `viewMode = 'multiple'`} to enable rendering a new view for each intercepted call
 * instead of updating a single rendered view. This allows stacking logs, notification snackbars, or any other aggregation functionality.
 * Combined with {@link OnObserverBaseDirective.showFor `showFor`}, this is great for disappearing messages/notifications.
 * 
 * #### View index
 * In multi-view mode, the context will contain the index of the view, which can be used for calculations and styling.
 *
 * #### Multi call interception
 * Create different interception combinations by specifying more than one call name in {@link OnObserverBaseDirective.renderOnCallsTo `renderOnCallsTo`}.
 * This allows, for example, the combination of `'error'` and `'complete'` to create a directive named `*onObserverFinalized`.
 * 
 * ## Extending
 * As this base class doesn't know what the properties of the extending class will be, extending classes must:
 * 1. Define their selector in the abstract {@link OnObserverBaseDirective.selector `selector`} property. This will allow the directive to
 * assign the view context with a property which will enable the microsyntax `as` keyword.
 * 2. Define the call(s) to intercept and render the view for in the abstract {@link OnObserverBaseDirective.renderOnCallsTo `renderOnCallsTo`}.
 * 3. Define an `@Input() set <selector>` property which will call `this.input.next(value)`.
 * 4. Define an `@Input() set <selector>ViewMode` property which will set `this.viewMode`.
 * 5. Define an `@Input() set <selector>ShowAfter` property which will set `this.showAfter`.
 * 6. Define an `@Input() set <selector>ShowFor` property which will set `this.showFor`.
 * 7. Define an `@Input() set <selector>CountdownInterval` property which will set `this.countdownInterval`.
 * 8. Define this static context type guard to allow strong typing the template:
 * ```ts
 * static ngTemplateContextGuard<T>(directive: ___DIRECTIVE_NAME___<T>, context: unknown): context is OnObserverContext<T>
 * { return true; }
 * ```
 * 
 * @export
 * @abstract
 * @class OnObserverBaseDirective
 * @extends {Destroyable}
 * @implements {OnInit}
 * @template T The type of value the observable will emit.
 */
@Directive()
export abstract class OnObserverBaseDirective<T> extends Destroyable implements OnInit
{
    /**
     * A global commitment map holding all commitments to render for which the directive has created commitment observables.
     * Ids are the timestamp of the observed calls and values are the commitments with their rendering parameters.
     *
     * @private
     * @type {RenderCommitmentMap<T>}
     */
    private commitments: RenderCommitmentMap<T> = new Map();

    /**
     * The first commitment in the {@link OnObserverBaseDirective.commitments global commitments map}. Used when working with a single view
     * to retrieve its corresponding single commitment.
     *
     * @readonly
     * @private
     * @type {ViewRenderCommitment<T>}
     */
    private get mainCommitment(): ViewRenderCommitment<T> { return this.commitments.values().next().value };

    /**
     * The selector defined for the directive extending this class. Will be used to create a corresponding
     * property in the view context in order to make the micro-syntax `as` keyword work.
     *
     * @protected
     * @abstract
     * @type {string}
     */
    protected abstract readonly selector: string;
    /**
     * The observer name(s) for which to intercept calls.
     *
     * @protected
     * @abstract
     * @type {(ObserverName | ObserverName[])}
     */
    protected abstract renderOnCallsTo  : ObserverName | ObserverName[];
    
    /**
     * (Optional) The view mode the directive will operate in:  
     * `'single'` - A single view will be rendered on intercepted calls. If a view has already been rendered when a call is intercepted,
     * the existing view will be updated with data from the new call.
     * 
     * `'multiple'` - Every new intercepted call will render a new view with its own context and data encapsulated from the current call.
     * 
     * Default is `'single'`.
     * 
     * ⚠️ Extending classes should:
     * 1. Declare an `@Input()` setter named `{selector}ViewMode` (e.g. onObserverCompleteViewMode) which will set this value.
     * 2. Provide the above documentation for the setter property.
     *
     * @default 'single'
     * @protected
     * @type {ViewMode}
     */
    protected viewMode          : ViewMode           = 'single';
    /**
     * (Optional) The duration for which the directive should wait before rendering the view once an intercepted call is made.
     * 
     * You can specify a number, which will be treated as milliseconds, or a string with the format of `<number><ms | s | ms>`.
     * Numbers can be either integers or floats.
     * For example:
     * - `3000` - Wait for 3 seconds, then render the view.
     * - `'10s'` - Wait for 10 seconds, then render the view.
     * - `'0.5m'` - Wait for 30 seconds, then render the view.
     * - `'100ms'` - Wait for 100 milliseconds, then render the view.
     * 
     * Default is `0`, meaning immediately render the view.
     *
     * TODO: ADD LINK TO TOUR OR FULL WIKI PAGE
     * Read more {@link OnObserverBaseDirective About render flow}.
     * 
     * ⚠️ Extending classes should:
     * 1. Declare an `@Input()` setter named `{selector}ShowAfter` (e.g. onObserverCompleteShowAfter) which will set this value.
     * 2. Provide the above documentation for the setter property.
     * 
     * @protected
     * @type {DurationAnnotation}
     */
    protected showAfter         : DurationAnnotation = 0;
    /**
     * (Optional) The duration for which the view should be rendered. When the duration passes, the view will be auto destroyed.
     *
     * You can specify a number, which will be treated as milliseconds, or a string with the format of `<number><ms | s | ms>`.
     * Numbers can be either integers or floats.
     * For example:
     * - `3000` - The view will be destroyed after 3 seconds.
     * - `'10s'` - The view will be destroyed after 10 seconds.
     * - `'0.5m'` - The view will be destroyed after 30 seconds.
     * - `'100ms'` - The view will be destroyed after 100 milliseconds.
     * 
     * During the time the view is rendered, the context will be updated with a countdown object to facilitate any UI part used to
     * indicate countdown to the user. The countdown will be exposed through the {@link OnObserverContext.showingFor `showingFor`}
     * property in the view context and can be accessed be declaring a `let` variable (e.g. `let remaining = showingFor`).
     * See {@link OnObserverBaseDirective.countdownInterval `countdownInterval`} for changing the updates interval.
     * 
     * When unspecified, the view will be destroyed immediately once the observer detects a call different to the intercepted ones.
     * 
     * TODO: ADD LINK TO TOUR OR FULL WIKI PAGE
     * Read more {@link OnObserverBaseDirective About render flow}.
     * 
     * ⚠️ Extending classes should:
     * 1. Declare an `@Input()` setter named `{selector}ShowFor` (e.g. onObserverCompleteShowFor) which will set this value.
     * 2. Provide the above documentation for the setter property.
     *
     * @protected
     * @type {DurationAnnotation}
     */
    protected showFor?          : DurationAnnotation;
    /**
     * ### Only used when passing a value to {@link OnObserverBaseDirective.showFor `showFor`}.
     * 
     * (Optional) The interval with which countdown updates should be made to the view's context before it auto destroys.
     * The lower the value, the more updates will be made to the context, but the more resources your directive will consume.
     * 
     * You can specify a number, which will be treated as milliseconds, or a string with the format of `<number><ms | s | ms>`.
     * Numbers can be either integers or floats.
     * For example:
     * - `3000` - 3 seconds between each update.
     * - `'10s'` - 10 seconds between each update.
     * - `'0.5m'` - 30 seconds between each update.
     * - `'100ms'` - 100 milliseconds between each update.
     * 
     * When unspecified, the total duration of the countdown will be divided by {@link DefaultCountdownUpdateCount `DefaultCountdownUpdateCount`}
     * to get a fixed interval which will make for {@link DefaultCountdownUpdateCount `DefaultCountdownUpdateCount`} countdown updates.
     * 
     * ⚠️ Extending classes should:
     * 1. Declare an `@Input()` setter named `{selector}CountdownInterval` (e.g. onObserverCompleteCountdownInterval) which will set this value.
     * 2. Provide the above documentation for the setter property.
     *
     * @protected
     * @type {DurationAnnotation}
     */
    protected countdownInterval?: DurationAnnotation;
    
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

    /**
     * `true` if {@link OnObserverBaseDirective.viewMode viewMode} is `'single'`; otherwise, `false`.
     *
     * @readonly
     * @type {boolean}
     */
    public get isSingleView(): boolean { return this.viewMode === 'single'  ; }
    /**
     * `true` if {@link OnObserverBaseDirective.viewMode viewMode} is `'multiple'`; otherwise, `false`.
     *
     * @readonly
     * @type {boolean}
     */
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

    /**
     * Destroys any rendered view.
     *
     * @private
     */
    private destroyAll(): void
    {
        this.commitments.forEach(({ view }) => view?.destroy());
    }

    /**
     * Creates the main feed the directive will subscribe to. The feed will listen to changed to {@link OnObserverBaseDirective.input `input`},
     * then switch to the newly received observable in order to start observing it.
     * The newly received observable will then be materialized and calls will be aggregated as commitment objects with information about
     * what to render and when. Those commitments will pass through the {@link OnObserverBaseDirective.onCommitmentsChanged onCommitmentsChanged()} method
     * which will update the global commitment and create observables with commitments to render and auto destroy views according to the
     * given commitments.
     * 
     * This feed is the single reactive entrypoint, meaning any observable created by the directive will be created inside of this
     * observable or its nested observables. Any time a nested observable is created it will be switched to. This allows the pipeline to
     * completely startover when a new call is made or a new {@link OnObserverBaseDirective.input `input`} observable is provided, thus keeping
     * a consistent stream of data to the {@link OnObserverBaseDirective.commitments global commitments map}.
     *
     * @private
     * @return {Observable<void[]>} An observable as described above.
     */
    private renderFeed(): Observable<void[]>
    {
        return this.input.pipe(
            // Make sure views are reset if a new observable is passed-in to the directive
            tap      (()          => this.destroyAll()),
            // Free memory once the directive is destroyed and the subscription closed
            // TODO: Will this actually execute? `this.subscribe()` doesn't complete the observable but unsubscribes on component destruction
            finalize (()          => this.destroyAll()),
            switchMap(input       => input ? this.observeInput(input) : EMPTY),
            map      (call        => this.shouldRender(call) ? this.aggregateCommitments(call) : this.deaggregateCommitments()),
            switchMap(commitments => this.onCommitmentsChanged(commitments)),
        );
    }

    /**
     * Materializes the observable and converts notifications to an {@link ObserverCall} object.
     * The returned observable will always start with a `'resolving'` call.
     *
     * @private
     * @param {Observable<T>} input The observable to watch.
     * @return {Observable<ObserverCall<T>>} A materialized observable which describes each observable notification as an {@link ObserverCall} object.
     */
    private observeInput(input: Observable<T>): Observable<ObserverCall<T>>
    {
        return input.pipe(
            materialize(),
            map        (ObserverCall.fromNotification),
            startWith  (ObserverCall.resolving<T>())
        );
    }

    /**
     * Checks whether the given observer call should be rendered according to the interception config in {@link OnObserverBaseDirective.renderOnCallsTo renderOnCallsTo}.
     *
     * @private
     * @param {ObserverCall<T>} The call to check.
     * @return {boolean} `true` if the call should be rendered; otherwise `false`.
     */
    private shouldRender({ name }: ObserverCall<T>): boolean
    {
        const observeOn = Array.isArray(this.renderOnCallsTo) ? this.renderOnCallsTo : [this.renderOnCallsTo];
        
        return observeOn.includes(name);
    }

    /**
     * Indicates whether any of the commitments is currently rendered.
     *
     * @readonly
     * @private
     * @type {boolean} `true` is any of the commitments is currently rendered; otherwise `false`.
     */
    private get alreadyRendered(): boolean
    {
        return Array.from(this.commitments.values()).some(commitment => commitment.isRendered);
    }
    
    /**
     * Creates the new commitments map when a new commitment should render.
     * 
     * When `viewMode` is `'single'` the map will always contain a single commitment. If the commitment hasn't been rendered yet, a new commitment will be created.
     * Otherwise, the existing commitment will be replaced by a clone with updated parameters (i.e. delay and countdown).
     * 
     * When `viewMode` is `'multiple'` a new commitment will always be added to the map.
     *
     * @private
     * @param {ObserverCall<T>} call The new call which should render.
     * @return {RenderCommitmentMap<T>} The new map of commitments to render.
     */
    private aggregateCommitments(call: ObserverCall<T>): RenderCommitmentMap<T>
    {
        const commitments   = this.commitments;
        const newCommitment = this.isSingleView && this.alreadyRendered
            ? ViewRenderCommitment.update(this.mainCommitment, call)
            : ViewRenderCommitment.create(call, durationToMs(this.showAfter), durationToMs(this.showFor || 0));

        return new Map(commitments.set(newCommitment.commitmentId, newCommitment));
    }

    /**
     * Creates the new commitments map when a new commitment shouldn't render.
     *
     * @private
     * @return {RenderCommitmentMap<T>} If `showFor` is specified, meaning views should be auto destroyed after a certain duration,
     * the current commitments will kept alive by returning them as a new map. This will allow recommiting to the same render parameters (i.e. delay and countdown).
     * Otherwise, when views should destroy immediately, an empty map will be returned.
     */
    private deaggregateCommitments(): RenderCommitmentMap<T>
    {
        return this.showFor ? new Map(this.commitments) : new Map();
    }
    
    /**
     * Handles the changes to the current commitment of the watched observable and creates and commits to render all commitments.
     * 
     * This will update the global commitment map. If an empty map is passed, all previous commitments will be destroyed.
     *
     * @private
     * @param {RenderCommitmentMap<T>} commitments The current commitment map.
     * @return {Observable<void[]>} An observable joining all render commitments.
     */
    private onCommitmentsChanged(commitments: RenderCommitmentMap<T>): Observable<void[]>
    {
        // If the commitment map has been reset, destroy any previously rendered view
        if (!commitments.size) this.destroyAll();

        // Update the global commitment map
        this.commitments = commitments;
        // Map all commitments to a commitment to render observable
        const runCommitments = Array.from(commitments.keys())
                                    .map((commitmentId, index) => this.commitToRender(commitments, commitmentId, index));
            
        return forkJoin(runCommitments);
    }
    
    /**
     * Creates an observable that initiates the render flow for an emission. Render flow is as follows:
     * 1. Delay render until the time for render (i.e. {@link ViewRenderCommitment.renderAt}) has come.
     * 2. Render the view.
     * 3. Update the {@link OnObserverBaseDirective.commitments global commitments map} with the rendered commitment.
     * 4. Initiate an auto destroy timer. See {@link OnObserverBaseDirective.autoDestroy autoDestroy()}.
     * 5. Remove the destroyed commitment from the {@link OnObserverBaseDirective.commitments global commitments map}.
     *
     * @private
     * @param {RenderCommitmentMap<T>} commitments The current commitment map holding all commitments to render.
     * @param {string} commitmentId The id of the commitment to render.
     * @param {number} index The index of the view to be rendered.
     * @return {Observable<void>} An observable that initiates the render flow for an emission.
     */
    private commitToRender(commitments: RenderCommitmentMap<T>, commitmentId: string, index: number): Observable<void>
    {
        if (!commitments.has(commitmentId)) throw new Error(`
            *${ this.selector } has encountered an inconsistency issue. Tried to commit to rendering commitment with ID ${ commitmentId }, but no commitment object exists with that ID.
            Please consider filing an issue and providing a stack trace here: https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+
        `);

        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        return of(commitments.get(commitmentId)!).pipe(
            switchMap(commitment         => this.delayRender(commitment)),
            // Actually perform rendering (or update the view if already rendered)
            switchMap(commitment         => this.renderCommitment(commitment, index)),
            // The commitment returned from `renderCommitment()` now contains the view, so update the global map
            tap      (renderedCommitment => commitments.set(commitmentId, renderedCommitment)),
            // Initiate the auto-destroy mechanism (will skip if `showFor` wasn't specified)
            switchMap(renderedCommitment => this.autoDestroy(renderedCommitment)),
            // Commitment has completed successfully. Remove it from the global map
            tap      (()                 => commitments.delete(commitmentId))
        );
    }

    /**
     * Creates an observable which delays the pipeline until the time to render the view (i.e. {@link ViewRenderCommitment.renderAt}) comes.
     *
     * @private
     * @param {ViewRenderCommitment<T>} commitment The commitment to delay.
     * @return {Observable<ViewRenderCommitment<T>>} An observable which delays the pipeline until the time to render the view (i.e. {@link ViewRenderCommitment.renderAt}) comes.
     */
    private delayRender(commitment: ViewRenderCommitment<T>): Observable<ViewRenderCommitment<T>>
    {
        return of(commitment).pipe(
            delay(new Date(commitment.renderAt)),
            mapTo(commitment)
        );
    }

    /**
     * Creates a new context for the given commitment and renders (or updates) the view.
     *
     * @private
     * @param {ViewRenderCommitment<T>} commitment The commitment for which to create the context and render the view.
     * @param {number} index The index of the view. If `viewMode` is `'single'` this should always be `0` as there is only one view.
     * @return {Observable<ViewRenderCommitment<T>>} An observable which renderes the commitment, then emits a new updated commitment referencing the rendered view.
     */
    private renderCommitment(commitment: ViewRenderCommitment<T>, index: number): Observable<ViewRenderCommitment<T>>
    {    
        return of(OnObserverContext.fromCommitment<T>(this.selector, index, commitment)).pipe(            
            map(context => this.renderOrUpdateView(commitment, context)),
        );
    }

    /**
     * Creates a timer observable which counts down until the time to destroy the view is reached, then destroys the view.
     * While the timer is running, the rendered view's context will be updated in fixed intervals with the time left before destruction.
     * 
     * @see {@link OnObserverBaseDirective.defineCountdownInterval defineCountdownInterval()} for more about the fixed countdown interval.
     *
     * @private
     * @param {ViewRenderCommitment<T>} commitment The rendered commitment for which to initiate auto destroy.
     * @return {Observable<void>} A timer observable which counts down until the time to destroy the view is reached, then destroys the view, while
     * updating the context with the time left for destruction.
     */
    private autoDestroy({ destroyAt, showFor, view }: ViewRenderCommitment<T>): Observable<void>
    {
        if (!(showFor && view)) return EMPTY;

        const countdownIntervalMs = this.defineCountdownInterval();
        
        return timer(0, countdownIntervalMs).pipe(
            map      (()         => destroyAt - Date.now()),
            map      (timeLeftMs => timeLeftMs < 0 ? 0 : timeLeftMs),
            tap      (timeLeftMs => this.updateViewContextCountdown(view, timeLeftMs)),
            takeWhile(timeLeftMs => timeLeftMs > 0, true),
            filter   (timeLeftMs => timeLeftMs <= 0),
            map      (()         => view.destroy())
        );
    }

    /**
     * Makes sure the specified commitment is rendered and its context is updated, then returns an updated commitment with the rendered (or updated) view.
     * If the view has been previously rendered, its context will be updated. Otherwise, the view will be rendered for the first time.
     * 
     * The new commitment will be used further down the pipeline to update the internal `commitments` map.
     * 
     * @see {@link OnObserverBaseDirective.commitToRender `commitToRender()`}.
     *
     * @private
     * @param {ViewRenderCommitment<T>} commitment The commitment for which the view should be rendered.countdown
     * @param {OnObserverContext<T>} context The context object to feed into the view.
     * @return {ViewRenderCommitment<T>} The new commitment containing the rendered (or updated) view.
     */
    private renderOrUpdateView(commitment: ViewRenderCommitment<T>, context: OnObserverContext<T>): ViewRenderCommitment<T>
    {
        if (commitment.view)
        {
            commitment.view.context = context;
            
            return ViewRenderCommitment.rendered(commitment, commitment.view);
        }
        
        return ViewRenderCommitment.rendered(commitment, this.viewContainer.createEmbeddedView(this.template, context));
    }

    /**
     * Breaks down the time left before the view is destroyed to its parts and updates the view context so that the user may present
     * a countdown or any other UI component indicating when the view will be destroyed.
     *
     * @private
     * @param {RenderedView<T>} view The view in which to update the countdown.
     * @param {number} timeLeftMs The time left (in milliseconds) for the view before being destroyed.
     */
    private updateViewContextCountdown(view: RenderedView<T>, timeLeftMs: number): void
    {    
        const showingFor = breakdownTime(timeLeftMs);

        const { $implicit, call, index } = view.context;

        view.context = new OnObserverContext(this.selector, index, call, $implicit, showingFor);
    }

    /**
     * Defines the interval (in milliseconds) with which countdown updates should be made to the view's context.
     * If the user has defined a value through {@link OnObserverBaseDirective.countdownInterval `countdownInterval`}, that value will be used.
     * Otherwise, {@link OnObserverBaseDirective.showFor `showFor`} will be divided by a fixed number defined by {@link DefaultCountdownUpdateCount `DefaultCountdownUpdateCount`}, currently 30, meaning the user will get
     * 30 countdown updates with fixed intervals between them before the view is destroyed.
     *
     * @private
     * @return {number} The interval with which countdown updates should be made to the view's context.
     */
    private defineCountdownInterval(): number
    {
        // If the view should persist, or it should auto-destroy but percision has been manually specified, do nothing
        if (!this.showFor) throw new Error(`
            Auto-destroy countdown seems to have been initiated when 'showFor' hasn't been set. This shouldn't have happend.
            Please consider filing an issue and providing a stack trace here: https://github.com/BeSpunky/angular-zen/issues/new?assignees=BeSpunky&labels=%F0%9F%90%9B+Bug&template=bug_report.md&title=%F0%9F%90%9B+
        `);
        
        if (this.countdownInterval) return durationToMs(this.countdownInterval);

        const showForMs = durationToMs(this.showFor);

        return showForMs / DefaultCountdownUpdateCount;
    }
}

import { EMPTY, Observable, Notification, BehaviorSubject                                        } from 'rxjs';
import { map, materialize, share, switchMap, tap                                                 } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef, EventEmitter, Output, OnInit } from '@angular/core';

import { Destroyable            } from '../../destroyable/destroyable';
import { ResolvedObserveContext } from './types/general';

/**
 * The base class for all `*observeXXX` directives.
 * This directive bind an observable or a collection of observables with a template, causing the values in the template to be updated whenever the observables emit.
 * 
 * Any template assigned with the directive will render immediately, and its view context will be updated with the emitted value on
 * each emission. The directive will be responsible for subscribing on init and unsubscribing on destroy.
 * 
 * ## Features
 * 
 * #### Shared observable
 * The watched observable will automatically be multicasted so that any child observables created by the template will use the same
 * stream.
 * 
 * The shared observable can be accessed using the `let source = source` microsyntax.
 * 
 * #### Observer events
 * Whenever the observable changes state or emits a value, the corresponding event is emitted:  
 * `nextCalled` - A value has been emitted. `$event` will be the emitted value.  
 * `errorCalled` - An error has occured in the pipeline. `$event` will be the error.  
 * `completeCalled` - The observable has completed. `$event` will be void.
 *
 * > Because of limitations to Angular's Structural Directives, in order to bind the events the desugared syntax must be used.
 * This, for example, **will trigger** the event:
 * > ```html
 * ><ng-template [observe]="x$" let-source="source" (nextCalled)="onNext($event)">
 * >    ...
 * ></ng-template>
 * > ```
 * >
 * >This **will NOT trigger** the event:
 * >```html
 * > <div *observe="x$; let source = source" (nextCalled)="onNext($event)">...</div>
 * >```
 * 
 * ## ⚠️ Extending notes:
 * As the base class cannot deduce the directive selector (e.g. `observeLatest`, `observeMerge`, etc.) the extending class
 * is required to do 4 things:
 * 1. Implement the abstract `selector` member and assign it with the directive's selector.
 * 2. Implement and `@Input() public set <selector>(value: T)` which will pass its value to the `input` member.
 * 3. Implement a static context TypeGuard.
 * 
 * These will enable Angular features like template type checking and the microsyntax `as` keyword.
 * 
 * @export
 * @abstract
 * @class ObserveBaseDirective
 * @extends {Destroyable}
 * @implements {OnInit}
 * @template TInput The type of value this directive will work with. Depends on the extending class.
 * @template TResolved The type of value emitted by the observable. Depends on the extending class.
 * @template TContext The type of the context object the template will work with.
 */
@Directive()
export abstract class ObserveBaseDirective<TInput, TResolved, TContext extends ResolvedObserveContext<TResolved>>
              extends Destroyable implements OnInit
{
    /**
     * Triggered whenever the observable emits a value. `$event` will be the emitted value.
     *
     * @type {EventEmitter<TResolved>}
     */
    @Output() public nextCalled    : EventEmitter<TResolved> = new EventEmitter();
    /**
     * Triggered when an error occurs in the observable's pipeline. `$event` will be the error.
     *
     * @type {EventEmitter<unknown>}
     */
    @Output() public errorCalled   : EventEmitter<unknown>   = new EventEmitter();
    /**
     * Triggered when the observable completes. `$event` will be the void.
     *
     * @type {EventEmitter<void>}
     */
    @Output() public completeCalled: EventEmitter<void>      = new EventEmitter();

    private view!: EmbeddedViewRef<TContext>;
    
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
     * ### Why BehaviorSubject<{@link TInput s} | null> and not Subject<{@link TInput}>
     * `input` is set from @Input properties. For some reason, Angular passes-in the first value BEFORE
     * ngOnInit, even though other @Input properties (e.g. showAfter, showFor) are passed AFTER ngOnInit.
     * If subscription occurs in the constructor, `input` will emit the first observable too fast, which
     * might lead to pipes breaking or misbehaving if they rely on properties to be instantiated first.
     * 
     * This leads to subscribing in ngOnInit, to allow Angular time to initialize those.
     * BUT, if `input` is a Subject, as the first value was already emitted BEFORE ngOnInit, it will not be
     * captured by our subscription to `input`. Hence the BehaviorSubject - To allow capturing that first observable.
     */
    protected readonly input: BehaviorSubject<TInput | null> = new BehaviorSubject(null as TInput | null);

    constructor(
        private readonly template     : TemplateRef<TContext>,
        private readonly viewContainer: ViewContainerRef
    )
    {
        super();
        
        this.renderView();
    }
    
    ngOnInit()
    {
        // See `this.input` documentation for why subscription is done in ngOnInit.
        this.subscribe(this.contextFeed());
    }

    /**
     * Takes the input passed to the directive (which might be an observable, a map or an array of observable for example)
     * and creates an observable that combines and represents all the observables in the value.
     * 
     * Intended for applying functions like `combineLatest()`, `contact()`, etc.
     * 
     * @protected
     * @abstract
     * @param {TInput} input The input passed to the directive (which might be an observable, a map or an array of observable for example).
     * @return {Observable<TResolved>} An observable which combines and represents all the observables in the input value.
     */
    protected abstract observeInput(input: TInput): Observable<TResolved>;

    private contextFeed(): Observable<Notification<TResolved>>
    {
        return this.input.pipe(
            // Whenever a new value is provided into the directive use the extender's implementation to observe it and multicast it.
            map      (input  => input ? this.observeInput(input).pipe(share()) : EMPTY),
            // Replace the source observable in the context with the newly created observable.
            tap      (source => this.updateViewContext({ source })),
            // Switch to the new observable and materialize it to watch for state changes and emit events accordingly
            switchMap(source => source.pipe(materialize())),
            // Whenever a materialized notification is emitted, handle it and emit the relevant event
            tap      (meta   => this.onStateChange(meta))
        );
    }

    private onStateChange(meta: Notification<TResolved>): void
    {
        // Call the appropriate handler according to the received notification
        return meta.observe({
            next: value =>
            {
                this.updateViewContext({ value });

                this.nextCalled.emit(value);
            },
            error   : error => this.errorCalled.emit(error),
            complete: ()    => this.completeCalled.emit()
        });
    }

    private renderView(): void
    {
        const context = this.createViewContext({});

        this.view = this.viewContainer.createEmbeddedView(this.template, context);
    }

    private updateViewContext(data: { value?: TResolved | null , source?: Observable<TResolved> }): void
    {    
        this.view.context = this.createViewContext(data);
    }

    protected createViewContext({ value, source }: { value?: TResolved | null , source?: Observable<TResolved> }): TContext
    {
        value  ??= this.view?.context.$implicit || null;
        source ??= this.view?.context.source    || EMPTY;

        return { $implicit: value, [this.selector]: value, source } as TContext;
    }
}

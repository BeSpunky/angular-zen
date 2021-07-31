import { EMPTY, Observable, Notification, Subject, BehaviorSubject                     } from 'rxjs';
import { map, materialize, share, switchMap, tap                                                 } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef, EventEmitter, Output, OnInit } from '@angular/core';

import { Destroyable            } from '../../destroyable/destroyable';
import { ResolvedObserveContext } from './types/general';

@Directive()
export abstract class ObserveBaseDirective<TInput, TResolved, TContext extends ResolvedObserveContext<TResolved>>
              extends Destroyable implements OnInit
{
    @Output() public nextCalled    : EventEmitter<TResolved> = new EventEmitter();
    @Output() public errorCalled   : EventEmitter<unknown>   = new EventEmitter();
    @Output() public completeCalled: EventEmitter<void>      = new EventEmitter();

    private view!: EmbeddedViewRef<TContext>;
    
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

    private contextFeed(): Observable<Notification<TResolved>>
    {
        return this.input.pipe(
            map      (input  => input ? this.observeInput(input).pipe(share()) : EMPTY),
            tap      (source => this.updateViewContext({ source })),
            switchMap(source => source.pipe(materialize())),
            tap      (meta   => this.onStateChange(meta))
        );
    }

    private onStateChange(meta: Notification<TResolved>): void
    {
        return meta.observe({
            next: value =>
            {
                this.updateViewContext({ value });

                this.nextCalled.emit(value);
            },
            error   : error => this.errorCalled.emit(error),
            complete: () => this.completeCalled.emit()
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

    protected abstract observeInput(input: TInput): Observable<TResolved>;
}

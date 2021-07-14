import { EMPTY, Observable, Notification, Subject                     } from 'rxjs';
import { map, materialize, share, switchMap, tap                                                 } from 'rxjs/operators';
import { Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef, EventEmitter, Output } from '@angular/core';

import { Destroyable            } from '../../destroyable/destroyable';
import { ResolvedObserveContext } from './types/general';

@Directive()
export abstract class ObserveBaseDirective<TInput, TResolved, TContext extends ResolvedObserveContext<TResolved>>
              extends Destroyable
{
    @Output() public nextCalled    : EventEmitter<TResolved> = new EventEmitter();
    @Output() public errorCalled   : EventEmitter<unknown>   = new EventEmitter();
    @Output() public completeCalled: EventEmitter<void>      = new EventEmitter();

    private view!: EmbeddedViewRef<TContext>;
    
    protected abstract readonly selector: string;
    protected readonly input: Subject<TInput> = new Subject();

    constructor(
        private readonly template     : TemplateRef<TContext>,
        private readonly viewContainer: ViewContainerRef
    )
    {
        super();
        
        this.renderView();

        this.subscribe(this.contextFeed());
    }

    private contextFeed(): Observable<Notification<TResolved>>
    {
        return this.input.pipe(
            tap(() => console.log(`👓 observe: new input. sharing...`)),

            map      (input  => input ? this.observeInput(input).pipe(share()) : EMPTY),
            tap((s) => console.log(`👓 observe: updating context with new source`, s)),
            tap      (source => this.updateViewContext({ source })),
            tap(() => console.log(`👓 observe: switching to materialized source`)),
            switchMap(source => source.pipe(materialize())),
            tap      (meta   => this.onStateChange(meta))
        );
    }

    private onStateChange(meta: Notification<TResolved>): void
    {
        console.log(`👓 observe: notification`, meta);

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

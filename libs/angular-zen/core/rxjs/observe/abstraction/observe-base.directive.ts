import { BehaviorSubject, combineLatest, EMPTY, Observable, of, Notification                     } from 'rxjs';
import { map, materialize, share, switchMap, tap                                                 } from 'rxjs/operators';
import { OnInit, Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef, EventEmitter, Output } from '@angular/core';

import { Destroyable            } from '../../destroyable/destroyable';
import { ResolvedObserveContext } from './types/general';

@Directive()
export abstract class ObserveBaseDirective<TInput, TResolved, TContext extends ResolvedObserveContext<TResolved>>
              extends Destroyable
           implements OnInit
{
    @Output() public nextCalled    : EventEmitter<TResolved> = new EventEmitter();
    @Output() public errorCalled   : EventEmitter<unknown>   = new EventEmitter();
    @Output() public completeCalled: EventEmitter<void>      = new EventEmitter();

    private view!: EmbeddedViewRef<TContext>;
    
    protected abstract readonly selector: string;
    protected readonly input: BehaviorSubject<TInput | null> = new BehaviorSubject(null as TInput | null);

    constructor(
        private readonly template     : TemplateRef<TContext>,
        private readonly viewContainer: ViewContainerRef
    )
    {
        super();
    }

    ngOnInit()
    {
        this.renderView();

        this.subscribe(this.contextFeed());
    }

    private contextFeed(): Observable<[Notification<TResolved>, Observable<TResolved>]>
    {
        return this.input.pipe(
            map      (input            => input ? this.observeInput(input).pipe(share()) : EMPTY),
            switchMap(input            => combineLatest([input.pipe(materialize()), of(input)])),
            tap      (([meta, source]) => this.onStateChange(meta, source))
        );
    }

    private onStateChange(meta: Notification<TResolved>, source: Observable<TResolved>): void
    {
        return meta.observe({
            next: value =>
            {
                const context = this.createViewContext(value, source);

                this.updateViewContext(context);

                this.nextCalled.emit(value);
            },
            error   : error => this.errorCalled.emit(error),
            complete: () => this.completeCalled.emit()
        });
    }

    private renderView(): void
    {
        this.view = this.viewContainer.createEmbeddedView(this.template);
    }

    private updateViewContext(context: TContext): void
    {    
        this.view.context = context;
    }

    protected createViewContext(value: TResolved, source: Observable<TResolved>): TContext
    {
        return { $implicit: value, [this.selector]: value, source } as TContext;
    }

    protected abstract observeInput(input: TInput): Observable<TResolved>;
}

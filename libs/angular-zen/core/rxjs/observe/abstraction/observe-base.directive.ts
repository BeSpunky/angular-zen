import { BehaviorSubject, combineLatest, EMPTY, Observable, of             } from 'rxjs';
import { map, share, switchMap                                             } from 'rxjs/operators';
import { OnInit, Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { Destroyable    } from '../../destroyable/destroyable';
import { ObserveContext } from './types/general';

@Directive()
export abstract class ObserveBaseDirective<TInput, TResolved, TContext extends ObserveContext<TResolved>>
              extends Destroyable
           implements OnInit
{
    private view!: EmbeddedViewRef<TContext>;
    
    protected readonly input: BehaviorSubject<TInput | null> = new BehaviorSubject(null as TInput | null);

    constructor(private readonly template: TemplateRef<TContext>, private readonly viewContainer: ViewContainerRef)
    {
        super();
    }

    ngOnInit()
    {
        this.renderView();

        this.subscribe(this.contextFeed(), context => this.updateViewContext(context));
    }

    private contextFeed(): Observable<TContext>
    {
        return this.input.pipe(
            map      (input             => input ? this.observeInput(input).pipe(share()) : EMPTY),
            switchMap(input             => combineLatest([input, of(input)])),
            map      (([value, source]) => this.createViewContext(value, source)),
        );
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
        return { $implicit: value, source } as TContext;
    }

    protected abstract observeInput(input: TInput): Observable<TResolved>;
}

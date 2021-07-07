import { BehaviorSubject, EMPTY, Observable                                } from 'rxjs';
import { map, switchMap                                                    } from 'rxjs/operators';
import { OnInit, Directive, EmbeddedViewRef, TemplateRef, ViewContainerRef } from '@angular/core';

import { Destroyable } from '../../destroyable';

export type ObserveContext<TResolved> = { $implicit: TResolved };

@Directive()
export abstract class ObserveBaseDirective<TInput, TResolved, TContext extends ObserveContext<TResolved>>
              extends Destroyable
           implements OnInit
{
    private view!: EmbeddedViewRef<TContext>;
    
    protected readonly input: BehaviorSubject<TInput | null> = new BehaviorSubject(null as TInput | null);
    
    public set observe(value: TInput) { this.input.next(value); }

    constructor(private template: TemplateRef<TContext>, private viewContainer: ViewContainerRef)
    {
        super();
    }

    ngOnInit()
    {
        this.view = this.viewContainer.createEmbeddedView(this.template);
        
        this.subscribe(this.contextFeed(), context => this.view.context = context);
    }
    
    private contextFeed(): Observable<TContext>
    {
        return this.input.pipe(
            switchMap(input => input ? this.observeInput(input) : EMPTY),
            map      (value => this.createViewContext(value))
        );
    }
    
    protected createViewContext(value: TResolved): TContext
    {
        return { $implicit: value } as TContext;
    }

    protected abstract observeInput(input: TInput): Observable<TResolved>;    
}

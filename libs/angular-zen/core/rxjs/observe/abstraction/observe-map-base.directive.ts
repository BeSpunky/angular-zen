import { Directive  } from '@angular/core';
import { Observable } from 'rxjs';

import { ObserveBaseDirective                           } from './observe-base.directive';
import { ObservableMap, EmittedMapOf, ObserveMapContext } from './types/maps';

@Directive()
export abstract class ObserveMapDirective<TInput extends ObservableMap, TContext extends ObserveMapContext<TInput>>
              extends ObserveBaseDirective<TInput, EmittedMapOf<TInput>, TContext>
{
    protected createViewContext(value: EmittedMapOf<TInput>, source: Observable<EmittedMapOf<TInput>>): TContext
    {
        return { $implicit: value, ...value, source } as TContext;
    }
}

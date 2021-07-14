import { Directive  } from '@angular/core';
import { Observable } from 'rxjs';

import { ObserveBaseDirective                           } from './observe-base.directive';
import { ObservableMap, EmittedMapOf, ObserveMapContext } from './types/maps';

@Directive()
export abstract class ObserveMapDirective<TInput extends ObservableMap, TContext extends ObserveMapContext<TInput>>
              extends ObserveBaseDirective<TInput, EmittedMapOf<TInput>, TContext>
{
    protected createViewContext(data: { value?: EmittedMapOf<TInput> | null , source?: Observable<EmittedMapOf<TInput>> }): TContext
    {
        return { ...super.createViewContext(data),  ...data.value };
    }
}

import { Observable } from 'rxjs';
import { Directive  } from '@angular/core';

import { ObserveContext, ObserveBaseDirective } from './observe-base.directive';

export type ObservableTupleOf<T extends unknown[]> =
    T extends [infer T0, ...(infer TRest)]
        ? TRest['length'] extends 0
            ? [Observable<T0>] 
            : [Observable<T0>, ...ObservableTupleOf<TRest>]
        : never;

@Directive()
export abstract class ObserveArrayDirective<T extends unknown[], TResolved>
              extends ObserveBaseDirective<ObservableTupleOf<T>, TResolved, ObserveContext<TResolved>>
{

}

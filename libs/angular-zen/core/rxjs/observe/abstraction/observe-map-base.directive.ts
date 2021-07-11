import { Directive  } from '@angular/core';
import { Observable } from 'rxjs';

import { ObserveBaseDirective                           } from './observe-base.directive';
import { ObservableMap, EmittedMapOf, ObserveMapContext } from './types/maps';

@Directive()
export abstract class ObserveMapDirective<T extends ObservableMap>
              extends ObserveBaseDirective<T, EmittedMapOf<T>, ObserveMapContext<T>>
{
    protected createViewContext(value: EmittedMapOf<T>, source: Observable<EmittedMapOf<T>>): ObserveMapContext<T>
    {
        return { $implicit: value, ...value, source };
    }
}

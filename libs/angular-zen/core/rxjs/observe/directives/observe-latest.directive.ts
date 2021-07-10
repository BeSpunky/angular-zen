import { Observable, combineLatest } from 'rxjs';
import { Directive, Input          } from '@angular/core';

import { ObserveMapDirective             } from '../abstraction/observe-map-base.directive';
import { ObserveMapContext, EmittedMapOf } from '../abstraction/types/maps';
import { observeAsArray                  } from '../_utils/_observe-as-array';

/**
 * Seems like for template typechecking to work with a generic type holding `any`, the generic type must be flattened
 * and not represented by a new type. When I tried creating an ObservableMap = { ...key: Observable<any> } and use it
 * as T extends ObservableMap, the type system failed to infer the inner types of the observables.
 * T extends { ...key: Observable<any> } works fine.
 */
@Directive({
    selector: '[observeLatest]'
})
export class ObserveLatestDirective<T extends { [key: string]: Observable<unknown> }>
     extends ObserveMapDirective<T>
{
    @Input() public set observeLatest(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends { [key: string]: Observable<unknown> }>(directive: ObserveLatestDirective<T>, context: unknown): context is ObserveMapContext<T> { return true; }
    
    protected observeInput(input: T): Observable<EmittedMapOf<T>>
    {
        return observeAsArray(input, observables => combineLatest(observables));
    }
}

import { Observable, combineLatest, EMPTY } from 'rxjs';
import { Directive, Input          } from '@angular/core';

import { ObserveMapDirective, Map, ObservableMapOf, observeAsArray, ObserveMapContext, ObservableMap } from './abstraction/observe-map-base.directive';

type ResolvedObservableMap<T> = {
    [key in keyof T]: T[key] extends Observable<infer TResolved> ? TResolved : never
};

/**
 * Seems like for template typechecking to work with a generic type holding `any`, the generic type must be flattened
 * and not represented by a new type. When I tried creating an ObservableMap = { ...key: Observable<any> } and use it
 * as T extends ObservableMap, the type system failed to infer the inner types of the observables.
 * T extends { ...key: Observable<any> } works fine.
 */
@Directive({
    selector: '[observeLatest]',
})
export class ObserveLatestDirective<T extends { [key: string]: Observable<any> }>
{
    @Input() public set observeLatest(value: T) { }
    
    static ngTemplateContextGuard<T extends { [key: string]: Observable<unknown> }>(directive: ObserveLatestDirective<T>, context: unknown)

    static ngTemplateContextGuard<T extends { [key: string]: Observable<any> }>(directive: ObserveLatestDirective<T>, context: unknown)
        : context is ObserveMapContext<ResolvedObservableMap<T>> { return true; }
}

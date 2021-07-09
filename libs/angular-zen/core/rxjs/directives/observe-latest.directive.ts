import { Observable, combineLatest, EMPTY } from 'rxjs';
import { Directive, Input          } from '@angular/core';

import { ObserveMapDirective, Map, ObservableMapOf, observeAsArray, ObserveMapContext, ObservableMap } from './abstraction/observe-map-base.directive';

type ResolvedObservableMap<T> = {
    [key in keyof T]: T[key] extends Observable<infer TResolved> ? TResolved : never
};

@Directive({
    selector: '[observeLatest]',
    // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
    // inputs: ['observe: observeLatest']
})
export class ObserveLatestDirective<T = unknown> //extends ObserveMapDirective<T>
{
    @Input() public set observeLatest(value: T) { /* this.input.next(value) */ }
    
    static ngTemplateGuard_observeLatest: 'binding';
    static ngTemplateContextGuard<T>(directive: ObserveLatestDirective<T>, context: unknown): context is ObserveMapContext<ResolvedObservableMap<T>> { return true; }

    protected observeInput(input: T): Observable<T>
    {
        // return observeAsArray(input, observables => combineLatest(observables));
        return EMPTY;
    }
}

import { Observable, combineLatest } from 'rxjs';
import { Directive, Input          } from '@angular/core';

import { ObserveMapDirective, Map, ObservableMapOf, observeAsArray, ObserveMapContext } from './abstraction/observe-map-base.directive';

@Directive({
    selector: '[observeLatest]',
    // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
    // inputs: ['observe: observeLatest']
})
export class ObserveLatestDirective<T extends Map> extends ObserveMapDirective<T>
{
    // static ngTemplateGuard_observeLatest<T extends {[k: string]: Observable<any>}>(dir: ObserveLatestDirective<T>, expr: any): expr is {[k: string]: Observable<any>} { return true; };
    static ngTemplateContextGuard<TT extends Map>(directive: ObserveLatestDirective<TT>, context: ObserveMapContext<TT>): context is ObserveMapContext<TT> { return true; }

    @Input() public set observeLatest(value: ObservableMapOf<T>) { this.input.next(value)}

    protected observeInput(input: ObservableMapOf<T>): Observable<T>
    {
        return observeAsArray(input, observables => combineLatest(observables));
    }
}

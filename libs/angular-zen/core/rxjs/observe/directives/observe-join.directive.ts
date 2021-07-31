import { Observable, forkJoin } from 'rxjs';
import { Directive, Input     } from '@angular/core';

import { ObserveMapDirective                            } from '../abstraction/observe-map-base.directive';
import { EmittedMapOf, ObservableMap, ObserveMapContext } from '../abstraction/types/maps';
import { observeAsArray                                 } from '../_utils/_observe-as-array';

type ObserveJoinContext<T extends ObservableMap> = ObserveMapContext<T> & {
    observeJoin: EmittedMapOf<T>
};

@Directive({
    selector: '[observeJoin]'
})
export class ObserveJoinDirective<T extends { [key: string]: Observable<unknown> }>
     extends ObserveMapDirective<T, ObserveJoinContext<T>>
{
    protected selector = 'observeJoin';

    @Input() public set observeJoin(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends { [key: string]: Observable<unknown> }>(directive: ObserveJoinDirective<T>, context: unknown): context is ObserveJoinContext<T> { return true; }
    
    protected observeInput(input: T): Observable<EmittedMapOf<T>>
    {
        return observeAsArray(input, observables => forkJoin(observables));
    }
}

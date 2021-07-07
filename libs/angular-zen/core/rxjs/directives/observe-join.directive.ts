import { Observable, forkJoin } from 'rxjs';
import { Directive            } from '@angular/core';

import { ObserveMapDirective, Map, ObservableMapOf, observeAsArray  } from './abstraction/observe-map-base.directive';

@Directive({
    selector: '[observeJoin]',
    // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
    inputs: ['observe: observeJoin']
})
export class ObserveJoinDirective<T extends Map> extends ObserveMapDirective<T>
{
    protected observeInput(input: ObservableMapOf<T>): Observable<T>
    {
        return observeAsArray(input, observables => forkJoin(observables));
    }
}

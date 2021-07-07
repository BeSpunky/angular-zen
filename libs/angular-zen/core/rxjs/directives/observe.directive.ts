import { Observable } from 'rxjs';
import { Directive  } from '@angular/core';
import { ObserveBaseDirective, ObserveContext } from './abstraction/observe-base.directive';

@Directive({
    selector: '[observe]',
    // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
    inputs  : ['observe: observe']
})
export class ObserveDirective<T> extends ObserveBaseDirective<Observable<T>, T, ObserveContext<T>>
{
    protected observeInput(input: Observable<T>): Observable<T>
    {
        return input;
    }    
}

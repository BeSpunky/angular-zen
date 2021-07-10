import { Observable        } from 'rxjs';
import { Directive, Input  } from '@angular/core';

import { ObserveBaseDirective          } from '../abstraction/observe-base.directive';
import { EmittedTypeOf, ObserveContext } from '../abstraction/types/general';

@Directive({
    selector: '[observe]'
})
export class ObserveDirective<T extends Observable<unknown>>
     extends ObserveBaseDirective<T, EmittedTypeOf<T>, ObserveContext<EmittedTypeOf<T>>>
{
    @Input() public set observe(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends Observable<unknown>>(directive: ObserveDirective<T>, context: unknown): context is ObserveContext<EmittedTypeOf<T>> { return true; }
    
    protected observeInput(input: T): Observable<EmittedTypeOf<T>>
    {
        return input as Observable<EmittedTypeOf<T>>;
    }
}

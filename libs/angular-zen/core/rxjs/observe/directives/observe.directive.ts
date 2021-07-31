import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { ObserveBaseDirective                  } from '../abstraction/observe-base.directive';
import { EmittedTypeOf, ResolvedObserveContext } from '../abstraction/types/general';

type ObserveContext<T extends Observable<unknown>> = ResolvedObserveContext<EmittedTypeOf<T>> & {
    observe: EmittedTypeOf<T>
};

@Directive({
    selector: '[observe]'
})
export class ObserveDirective<T extends Observable<unknown>>
     extends ObserveBaseDirective<T, EmittedTypeOf<T>, ObserveContext<T>>
{
    protected selector = 'observe';

    @Input() public set observe(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends Observable<unknown>>(directive: ObserveDirective<T>, context: unknown): context is ObserveContext<T> { return true; }
    
    protected observeInput(input: T): Observable<EmittedTypeOf<T>>
    {
        return input as Observable<EmittedTypeOf<T>>;
    }
}

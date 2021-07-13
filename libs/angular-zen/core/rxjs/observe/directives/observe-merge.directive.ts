import { Observable, merge } from 'rxjs';
import { Directive, Input  } from '@angular/core';

import { ObserveArrayDirective                } from '../abstraction/observe-array-base.directive';
import { ResolvedObserveContext               } from '../abstraction/types/general';
import { ObservableArray, EmittedArrayTypesOf } from '../abstraction/types/arrays';

type ObserveMergeContext<T extends ObservableArray> = ResolvedObserveContext<EmittedArrayTypesOf<T>> & {
    observeMerge: EmittedArrayTypesOf<T>
};

@Directive({
    selector: '[observeMerge]'
})
export class ObserveMergeDirective<T extends Observable<unknown>[]>
     extends ObserveArrayDirective<T, EmittedArrayTypesOf<T>, ObserveMergeContext<T>>
{
    protected selector = 'observeMerge';

    @Input() public set observeMerge(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends Observable<unknown>[]>(directive: ObserveMergeDirective<T>, context: unknown): context is ObserveMergeContext<T> { return true; }
    
    protected observeInput(input: T): Observable<EmittedArrayTypesOf<T>>
    {
        return merge(...input) as Observable<EmittedArrayTypesOf<T>>;
    }
}

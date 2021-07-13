import { Observable, concat } from 'rxjs';
import { Directive, Input   } from '@angular/core';

import { ObserveArrayDirective  } from '../abstraction/observe-array-base.directive';
import { ResolvedObserveContext } from '../abstraction/types/general';
import { EmittedArrayTypesOf    } from '../abstraction/types/arrays';

type ObserveConcatContext<TInput extends Observable<unknown>[]> = ResolvedObserveContext<EmittedArrayTypesOf<TInput>> & {
    observeConcat: EmittedArrayTypesOf<TInput>
};

@Directive({
    selector: '[observeConcat]'
})
export class ObserveConcatDirective<T extends Observable<unknown>[]>
     extends ObserveArrayDirective<T, EmittedArrayTypesOf<T>, ObserveConcatContext<T>>
{
    protected selector = 'observeConcat';

    @Input() public set observeConcat(value: T) { this.input.next(value); }

    static ngTemplateContextGuard<T extends Observable<unknown>[]>(directive: ObserveConcatDirective<T>, context: unknown): context is ObserveConcatContext<T> { return true; }

    protected observeInput(input: T): Observable<EmittedArrayTypesOf<T>>
    {
        return concat(...input) as Observable<EmittedArrayTypesOf<T>>;
    }
}

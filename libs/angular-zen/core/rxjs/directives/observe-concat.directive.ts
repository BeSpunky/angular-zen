import { Observable, concat } from 'rxjs';
import { Directive         } from '@angular/core';

import { ObserveArrayDirective } from './abstraction/observe-array-base.directive';
import { ObserveContext } from './abstraction/observe-base.directive';

type ObservedTypesOf<T> = T extends Observable<infer Observerd>[] ? Observerd : never;

@Directive({
    selector: '[observeConcat]',
    // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
    inputs  : ['observe: observeConcat']
})
export class ObserveConcatDirective<TInput extends Observable<any>[]> extends ObserveArrayDirective<TInput, ObservedTypesOf<TInput>>
{
    static ngTemplateContextGuard<TInput extends Observable<any>[]>(directive: ObserveConcatDirective<TInput>, context: unknown): context is ObserveContext<TInput> { return true; }

    protected observeInput(input: TInput): ObservedTypesOf<TInput>
    {
        return concat(...input) as ObservedTypesOf<TInput>;
    }
}

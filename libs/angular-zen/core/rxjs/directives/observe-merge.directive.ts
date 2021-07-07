import { Observable, merge } from 'rxjs';
import { Directive         } from '@angular/core';

import { ObserveArrayDirective } from './abstraction/observe-array-base.directive';

type ObservedTypesOf<T> = T extends Observable<infer Observerd>[] ? Observerd : never;

@Directive({
    selector: '[observeMerge]',
    // eslint-disable-next-line @angular-eslint/no-inputs-metadata-property
    inputs  : ['observe: observeMerge']
})
export class ObserveMergeDirective<TInput extends Observable<any>[]> extends ObserveArrayDirective<TInput, ObservedTypesOf<TInput>>
{
    protected observeInput(input: TInput): ObservedTypesOf<TInput>
    {
        return merge(...input) as ObservedTypesOf<TInput>;
    }
}

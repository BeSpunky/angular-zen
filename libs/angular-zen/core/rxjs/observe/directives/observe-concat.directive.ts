import { Observable, concat } from 'rxjs';
import { Directive, Input   } from '@angular/core';

import { ObserveArrayDirective  } from '../abstraction/observe-array-base.directive';
import { ResolvedObserveContext } from '../abstraction/types/general';
import { EmittedArrayTypesOf    } from '../abstraction/types/arrays';

type ObserveConcatContext<TInput extends Observable<unknown>[]> = ResolvedObserveContext<EmittedArrayTypesOf<TInput>> & {
    observeConcat: EmittedArrayTypesOf<TInput>
};

/**
 * Documentation in {@link ObserveConcatDirective.observeConcat} to allow in-template tooltips.
 *
 * @export
 * @class ObserveConcatDirective
 * @extends {ObserveArrayDirective<T, EmittedArrayTypesOf<T>, ObserveConcatContext<T>>}
 * @template T The type of observables tuple received by the directive.
 */
@Directive({
    selector: '[observeConcat]'
})
export class ObserveConcatDirective<T extends Observable<unknown>[]>
     extends ObserveArrayDirective<T, EmittedArrayTypesOf<T>, ObserveConcatContext<T>>
{
    protected selector = 'observeConcat';

    /**
     * Concats an array of observables using rxjs {@link concat concat()} and exposes the emitted values to the template.
     * 
     * Any template assigned with the directive will render immediately, and its view context will be updated with the emitted value on
     * each emission. The directive will be responsible for subscribing on init and unsubscribing on destroy.
     * 
     * ## Features
     * 
     * #### Shared observable
     * The watched observable will automatically be multicasted so that any child observables created by the template will use the same
     * stream.
     * 
     * The shared observable can be accessed using the `let source = source` microsyntax.
     * 
     * #### Observer events
     * Whenever the observable changes state or emits a value, the corresponding event is emitted:
     * `nextCalled` - A value has been emitted. `$event` will be emitted value.
     * `errorCalled` - An error has occured in the pipeline. `$event` will be the error.
     * `completeCalled` - The observable has completed. `$event` will be void.
     * 
     * Because of limitations to Angular's Structural Directives, in order to bind the events the desugared syntax must be used.
     * This, for example, will not trigger the event:
     * ```html
     * <div *observeConcat="[x$, y$]; let source = source" (nextCalled)="onNext($event)">...</div>
     * ```
     * 
     * This *will*:
     * ```
     * <ng-template [observeConcat]="[x$, y$]" let-source="source" (nextCalled)="onNext($event)">
     *      <div>...</div>
     * </ng-template>
     * ```
     */
    @Input() public set observeConcat(value: T) { this.input.next(value); }

    static ngTemplateContextGuard<T extends Observable<unknown>[]>(directive: ObserveConcatDirective<T>, context: unknown): context is ObserveConcatContext<T> { return true; }

    protected observeInput(input: T): Observable<EmittedArrayTypesOf<T>>
    {
        return concat(...input) as Observable<EmittedArrayTypesOf<T>>;
    }
}

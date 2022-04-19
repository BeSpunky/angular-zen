import { Observable, merge } from 'rxjs';
import { Directive, Input  } from '@angular/core';

import { ObserveArrayDirective                } from '../abstraction/observe-array-base.directive';
import { ResolvedObserveContext               } from '../abstraction/types/general';
import { ObservableArray, EmittedArrayTypesOf } from '../abstraction/types/arrays';

type ObserveMergeContext<T extends ObservableArray> = ResolvedObserveContext<EmittedArrayTypesOf<T>> & {
    observeMerge: EmittedArrayTypesOf<T>
};

/**
 * Documentation in {@link ObserveMergeDirective.observeMerge} to allow in-template tooltips.
 *
 * @export
 * @class ObserveMergeDirective
 * @extends {ObserveArrayDirective<T, EmittedArrayTypesOf<T>, ObserveMergeContext<T>>}
 * @template T The type of observables tuple received by the directive.
 */
@Directive({
    selector: '[observeMerge]'
})
export class ObserveMergeDirective<T extends Observable<unknown>[]>
     extends ObserveArrayDirective<T, EmittedArrayTypesOf<T>, ObserveMergeContext<T>>
{
    protected selector = 'observeMerge';

    /**
     * Combines an array of observables using rxjs {@link https://rxjs.dev/api/index/function/merge merge()} and exposes the emitted values to the template.
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
    @Input() public set observeMerge(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends Observable<unknown>[]>(directive: ObserveMergeDirective<T>, context: unknown): context is ObserveMergeContext<T> { return true; }
    
    protected observeInput(input: T): Observable<EmittedArrayTypesOf<T>>
    {
        return merge(...input) as Observable<EmittedArrayTypesOf<T>>;
    }
}

import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { ObserveBaseDirective                  } from '../abstraction/observe-base.directive';
import { EmittedTypeOf, ResolvedObserveContext } from '../abstraction/types/general';

type ObserveContext<T extends Observable<unknown>> = ResolvedObserveContext<EmittedTypeOf<T>> & {
    observe: EmittedTypeOf<T>
};

/**
 * Documentation in {@link ObserveDirective.observe} to allow in-template tooltips.
 *
 * @export
 * @class ObserveDirective
 * @extends {ObserveBaseDirective<T, EmittedTypeOf<T>, ObserveContext<T>>}
 * @template T The type of observable received by the directive.
 */
@Directive({
    selector: '[observe]'
})
export class ObserveDirective<T extends Observable<unknown>>
     extends ObserveBaseDirective<T, EmittedTypeOf<T>, ObserveContext<T>>
{
    protected selector = 'observe';

    /**
     * Tracks an observable and updated the template with its emitted value on each emission.
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
     * <div *observe="x$; let source = source" (nextCalled)="onNext($event)">...</div>
     * ```
     * 
     * This *will*:
     * ```
     * <ng-template [observe]="x$" let-source="source" (nextCalled)="onNext($event)">
     *      <div>...</div>
     * </ng-template>
     * ```
     */
    @Input() public set observe(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends Observable<unknown>>(directive: ObserveDirective<T>, context: unknown): context is ObserveContext<T> { return true; }
    
    protected observeInput(input: T): Observable<EmittedTypeOf<T>>
    {
        return input as Observable<EmittedTypeOf<T>>;
    }
}

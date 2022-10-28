import { Observable, combineLatest } from 'rxjs';
import { Directive, Input          } from '@angular/core';

import { ObserveMapDirective                            } from '../abstraction/observe-map-base.directive';
import { ObserveMapContext, EmittedMapOf, ObservableMap } from '../abstraction/types/maps';

type ObserveLatestContext<T extends ObservableMap> = ObserveMapContext<T> & {
    observeLatest: EmittedMapOf<T>
};

/**
 * Documentation in {@link ObserveLatestDirective.observeLatest} to allow in-template tooltips.
 * @export
 * @class ObserveLatestDirective
 * @extends {ObserveMapDirective<T, ObserveLatestContext<T>>}
 * @template T The type of observables map received by the directive.
 */
@Directive({
    selector: '[observeLatest]'
})
export class ObserveLatestDirective<T extends { [key: string]: Observable<unknown> }>
     extends ObserveMapDirective<T, ObserveLatestContext<T>>
{
    // Seems like for template typechecking to work with a generic type holding `unknown`, the generic type must be flattened
    // and not represented by a new type. When I tried creating an ObservableMap = { ...key: Observable<unknown> } and use it
    // as T extends ObservableMap, the type system failed to infer the inner types of the observables.
    // T extends { ...key: Observable<unknown> } works fine.

    protected selector = 'observeLatest';

    /**
     * Combines a map of observables using rxjs {@link https://rxjs.dev/api/index/function/combineLatest combineLatest()} and exposes the emitted values to the template.
     * Values are exposed in a map which keys are the same keys as the original observable map and values are
     * the emitted values corresponding to those keys.
     * 
     * Emitted values will be available as the implicit context values but will also be spread into the context by key.
     * Meaning, this would work:
     * ```html
     * <div *observeLatest="{ x: x$, y: y$ } as result">{{result.x}}</div>
     * ```
     * 
     * And this also:
     * ```
     * <div *observeLatest="{ x: x$, y: y$ }; let x = x">{{x}}</div>
     * ```
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
     * `nextCalled` - A value has been emitted. `$event` will be the emitted value.  
     * `errorCalled` - An error has occured in the pipeline. `$event` will be the error.  
     * `completeCalled` - The observable has completed. `$event` will be void.
     *
     * > Because of limitations to Angular's Structural Directives, in order to bind the events the desugared syntax must be used.
     * This, for example, **will trigger** the event:
     * > ```html
     * ><ng-template [observe]="x$" let-source="source" (nextCalled)="onNext($event)">
     * >    ...
     * ></ng-template>
     * > ```
     * >
     * >This **will NOT trigger** the event:
     * >```html
     * > <div *observe="x$; let source = source" (nextCalled)="onNext($event)">...</div>
     * >```
     */
    @Input() public set observeLatest(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends { [key: string]: Observable<unknown> }>(directive: ObserveLatestDirective<T>, context: unknown): context is ObserveLatestContext<T> { return true; }
    
    protected observeInput(input: T): Observable<EmittedMapOf<T>>
    {
        return combineLatest(input) as Observable<EmittedMapOf<T>>;
    }
}

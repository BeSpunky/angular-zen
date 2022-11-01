import { Observable, forkJoin } from 'rxjs';
import { Directive, Input     } from '@angular/core';

import { ObserveMapDirective                            } from '../abstraction/observe-map-base.directive';
import { EmittedMapOf, ObservableMap, ObserveMapContext } from '../abstraction/types/maps';

type ObserveJoinContext<T extends ObservableMap> = ObserveMapContext<T> & {
    observeJoin: EmittedMapOf<T>
};

/**
 * Documentation in {@link ObserveJoinDirective.observeJoin} to allow in-template tooltips.
 * @export
 * @class ObserveJoinDirective
 * @extends {ObserveMapDirective<T, ObserveJoinContext<T>>}
 * @template T The type of observables map received by the directive.
 */
@Directive({
    selector: '[observeJoin]'
})
export class ObserveJoinDirective<T extends { [key: string]: Observable<unknown> }>
     extends ObserveMapDirective<T, ObserveJoinContext<T>>
{
    protected selector = 'observeJoin';

    /**
     * Joins a map of observables using rxjs {@link https://rxjs.dev/api/index/function/forkJoin forkJoin()} and exposes the emitted values to the template.
     * Values are exposed in a map which keys are the same keys as the original observable map and values are
     * the emitted values corresponding to those keys.
     * 
     * Emitted values will be available as the implicit context values but will also be spread into the context by key.
     * Meaning, this would work:
     * ```html
     * <div *observeJoin="{ x: x$, y: y$ } as result">{{result.x}}</div>
     * ```
     * 
     * And this also:
     * ```
     * <div *observeJoin="{ x: x$, y: y$ }; let x = x">{{x}}</div>
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
    @Input() public set observeJoin(value: T) { this.input.next(value); }
    
    static ngTemplateContextGuard<T extends { [key: string]: Observable<unknown> }>(directive: ObserveJoinDirective<T>, context: unknown): context is ObserveJoinContext<T> { return true; }
    
    protected observeInput(input: T): Observable<EmittedMapOf<T>>
    {
        return forkJoin(input) as Observable<EmittedMapOf<T>>;
    }
}

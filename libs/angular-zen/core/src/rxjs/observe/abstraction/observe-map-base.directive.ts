import { Directive  } from '@angular/core';
import { Observable } from 'rxjs';

import { ObserveBaseDirective                           } from './observe-base.directive';
import { ObservableMap, EmittedMapOf, ObserveMapContext } from './types/maps';

/**
 * The base class for `*observe` directives combining observables using a map of observable values (i.e. { x: x$, y: y$ }).
 *
 * Emitted values will be available as the implicit context values but will also be spread into the context by key.
 * Meaning, this would work:
 * ```html
 * <div *observeXXX="{ x: x$, y: y$ } as result">{{result.x}}</div>
 * ```
 * 
 * And this also:
 * ```
 * <div *observeXXX="{ x: x$, y: y$ }; let x = x">{{x}}</div>
 * ```
 * 
 * @export
 * @abstract
 * @class ObserveMapDirective
 * @extends {ObserveBaseDirective<TInput, EmittedMapOf<TInput>, TContext>}
 * @template TInput The type of observable map.
 * @template TContext The the of context the directive will provide to the view.
 */
@Directive()
export abstract class ObserveMapDirective<TInput extends ObservableMap, TContext extends ObserveMapContext<TInput>>
              extends ObserveBaseDirective<TInput, EmittedMapOf<TInput>, TContext>
{
    protected override createViewContext(data: { value?: EmittedMapOf<TInput> | null , source?: Observable<EmittedMapOf<TInput>> }): TContext
    {
        // Spread the values emitted from the observable to allow `let` microsyntax and directly accessing them
        return { ...super.createViewContext(data),  ...data.value };
    }
}

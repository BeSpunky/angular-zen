import { Directive  } from '@angular/core';

import { ObserveBaseDirective   } from './observe-base.directive';
import { ResolvedObserveContext } from './types/general';
import { ObservableArray        } from './types/arrays';

/**
 * The base class for `*observe` directives combining observables using an array of observable values (i.e. [x$, y$]).
 *
 * @export
 * @abstract
 * @class ObserveArrayDirective
 * @extends {ObserveBaseDirective<TInput, TResolved, TContext>}
 * @template TInput The type of observable array.
 * @template TResolved The type of resolved array.
 * @template TContext The the of context the directive will provide to the view.
 */
@Directive()
export abstract class ObserveArrayDirective<TInput extends ObservableArray, TResolved, TContext extends ResolvedObserveContext<TResolved> = ResolvedObserveContext<TResolved>>
              extends ObserveBaseDirective<TInput, TResolved, TContext>
{

}

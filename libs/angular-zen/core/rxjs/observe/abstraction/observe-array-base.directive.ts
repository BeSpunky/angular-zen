import { Directive  } from '@angular/core';

import { ObserveBaseDirective   } from './observe-base.directive';
import { ResolvedObserveContext } from './types/general';
import { ObservableArray        } from './types/arrays';

@Directive()
export abstract class ObserveArrayDirective<TInput extends ObservableArray, TResolved, TContext extends ResolvedObserveContext<TResolved> = ResolvedObserveContext<TResolved>>
              extends ObserveBaseDirective<TInput, TResolved, TContext>
{

}

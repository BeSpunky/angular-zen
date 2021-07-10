import { Directive  } from '@angular/core';

import { ObserveBaseDirective } from './observe-base.directive';
import { ObserveContext       } from './types/general';
import { ObservableArray      } from './types/arrays';

@Directive()
export abstract class ObserveArrayDirective<T extends ObservableArray, TResolved>
              extends ObserveBaseDirective<T, TResolved, ObserveContext<TResolved>>
{

}

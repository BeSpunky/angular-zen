import { NgModule } from '@angular/core';

import { OnObserverDirective          } from './directives/on-observer.directive';
import { OnObserverResolvingDirective } from './directives/on-observer-resolving.directive';
import { OnObserverNextDirective      } from './directives/on-observer-next.directive';
import { OnObserverErrorDirective     } from './directives/on-observer-error.directive';
import { OnObserverCompleteDirective  } from './directives/on-observer-complete.directive';
import { OnObserverActiveDirective    } from './directives/on-observer-active.directive';
import { OnObserverFinalizedDirective } from './directives/on-observer-finalized.directive';

@NgModule({
    declarations: [
        OnObserverDirective,
        OnObserverResolvingDirective,
        OnObserverNextDirective,
        OnObserverErrorDirective,
        OnObserverCompleteDirective,
        OnObserverActiveDirective,
        OnObserverFinalizedDirective,
    ],
    exports: [
        OnObserverDirective,
        OnObserverResolvingDirective,
        OnObserverNextDirective,
        OnObserverErrorDirective,
        OnObserverCompleteDirective,
        OnObserverActiveDirective,
        OnObserverFinalizedDirective,
    ]
})
export class OnObserverModule { }

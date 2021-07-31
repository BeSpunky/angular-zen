import { NgModule } from '@angular/core';

import { DocumentRefProviders         } from './document-ref/document-ref.service';
import { WindowRefProviders           } from './window-ref/window-ref.service';
import { ObserveDirective             } from './rxjs/observe/directives/observe.directive';
import { ObserveLatestDirective       } from './rxjs/observe/directives/observe-latest.directive';
import { ObserveConcatDirective       } from './rxjs/observe/directives/observe-concat.directive';
import { ObserveJoinDirective         } from './rxjs/observe/directives/observe-join.directive';
import { ObserveMergeDirective        } from './rxjs/observe/directives/observe-merge.directive';
import { OnObserverDirective          } from './rxjs/on-observer/directives/on-observer.directive';
import { OnObserverResolvingDirective } from './rxjs/on-observer/directives/on-observer-resolving.directive';
import { OnObserverNextDirective      } from './rxjs/on-observer/directives/on-observer-next.directive';
import { OnObserverErrorDirective     } from './rxjs/on-observer/directives/on-observer-error.directive';
import { OnObserverCompleteDirective  } from './rxjs/on-observer/directives/on-observer-complete.directive';
import { OnObserverActiveDirective    } from './rxjs/on-observer/directives/on-observer-active.directive';
import { OnObserverFinalizedDirective } from './rxjs/on-observer/directives/on-observer-finalized.directive';

@NgModule({
    providers: [
        WindowRefProviders,
        DocumentRefProviders
    ],
    declarations: [
        ObserveDirective,
        ObserveLatestDirective,
        ObserveJoinDirective,
        ObserveMergeDirective,
        ObserveConcatDirective,
        OnObserverDirective,
        OnObserverResolvingDirective,
        OnObserverNextDirective,
        OnObserverErrorDirective,
        OnObserverCompleteDirective,
        OnObserverActiveDirective,
        OnObserverFinalizedDirective,
    ],
    exports: [
        ObserveDirective,
        ObserveLatestDirective,
        ObserveJoinDirective,
        ObserveMergeDirective,
        ObserveConcatDirective,
        OnObserverDirective,
        OnObserverResolvingDirective,
        OnObserverNextDirective,
        OnObserverErrorDirective,
        OnObserverCompleteDirective,
        OnObserverActiveDirective,
        OnObserverFinalizedDirective,
    ]
})
export class CoreModule { }

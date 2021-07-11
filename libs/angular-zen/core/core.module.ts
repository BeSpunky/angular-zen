import { NgModule } from '@angular/core';

import { DocumentRefProviders   } from './document-ref/document-ref.service';
import { WindowRefProviders     } from './window-ref/window-ref.service';
import { ObserveDirective       } from './rxjs/observe/directives/observe.directive';
import { ObserveLatestDirective } from './rxjs/observe/directives/observe-latest.directive';
import { ObserveConcatDirective } from './rxjs/observe/directives/observe-concat.directive';
import { ObserveJoinDirective   } from './rxjs/observe/directives/observe-join.directive';
import { ObserveMergeDirective  } from './rxjs/observe/directives/observe-merge.directive';
import { OnObserverDirective    } from './rxjs/on-observer/directives/on-observer.directive';

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
    ],
    exports: [
        ObserveDirective,
        ObserveLatestDirective,
        ObserveJoinDirective,
        ObserveMergeDirective,
        ObserveConcatDirective,
        OnObserverDirective,
    ]
})
export class CoreModule { }

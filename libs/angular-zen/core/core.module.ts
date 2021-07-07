import { NgModule } from '@angular/core';

import { DocumentRefProviders   } from './document-ref/document-ref.service';
import { WindowRefProviders     } from './window-ref/window-ref.service';
import { ObserveDirective       } from './rxjs/directives/observe.directive';
import { ObserveLatestDirective } from './rxjs/directives/observe-latest.directive';
import { ObserveConcatDirective } from './rxjs/directives/observe-concat.directive';
import { ObserveJoinDirective   } from './rxjs/directives/observe-join.directive';
import { ObserveMergeDirective  } from './rxjs/directives/observe-merge.directive';

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
    ],
    exports: [
        ObserveDirective,
        ObserveLatestDirective,
        ObserveJoinDirective,
        ObserveMergeDirective,
        ObserveConcatDirective,    ]
})
export class CoreModule { }

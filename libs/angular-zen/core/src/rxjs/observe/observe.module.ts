import { NgModule } from '@angular/core';

import { ObserveDirective       } from './directives/observe.directive';
import { ObserveLatestDirective } from './directives/observe-latest.directive';
import { ObserveConcatDirective } from './directives/observe-concat.directive';
import { ObserveJoinDirective   } from './directives/observe-join.directive';
import { ObserveMergeDirective  } from './directives/observe-merge.directive';

/**
 * Provides directives to facilitate in-template subscription management to observables.
 *
 * @export
 * @class ObserveModule
 */
@NgModule({
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
        ObserveConcatDirective,
    ]
})
export class ObserveModule { }

import { NgModule } from '@angular/core';
import { BrowserOnlyDirective      } from './directives/browser-only.directive';
import { ServerOnlyDirective       } from './directives/server-only.directive';
import { WorkerAppOnlyDirective    } from './directives/worker-app-only.directive';
import { WorkerUiOnlyDirective     } from './directives/worker-ui-only.directive';
import { NonBrowserOnlyDirective   } from './directives/non-browser-only.directive';
import { NonServerOnlyDirective    } from './directives/non-server-only.directive';
import { NonWorkerAppOnlyDirective } from './directives/non-worker-app-only.directive';
import { NonWorkerUiOnlyDirective  } from './directives/non-worker-ui-only.directive';

const exported = [
    BrowserOnlyDirective,
    ServerOnlyDirective,
    WorkerAppOnlyDirective,
    WorkerUiOnlyDirective,
    
    NonBrowserOnlyDirective,
    NonServerOnlyDirective,
    NonWorkerAppOnlyDirective,
    NonWorkerUiOnlyDirective
];

/**
 * Provides facilitating tools for work with Angular Universal.
 *
 * @export
 * @class UniversalModule
 */
@NgModule({
    declarations: exported,
    exports     : exported
})
export class UniversalModule { }

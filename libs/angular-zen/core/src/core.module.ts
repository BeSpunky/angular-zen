import { NgModule } from '@angular/core';

import { DocumentRefProviders } from './document-ref/document-ref.service';
import { WindowRefProviders   } from './window-ref/window-ref.service';
import { ObserveModule        } from './rxjs/observe/observe.module';
import { OnObserverModule     } from './rxjs/on-observer/on-observer.module';

@NgModule({
    providers: [
        WindowRefProviders,
        DocumentRefProviders
    ],
    imports: [
        ObserveModule,
        OnObserverModule
    ],
    exports: [
        ObserveModule,
        OnObserverModule
    ]
})
export class CoreModule { }

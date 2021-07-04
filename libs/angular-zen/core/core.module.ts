import { NgModule             } from '@angular/core';
import { DocumentRefProviders } from './document-ref/document-ref.service';
import { WindowRefProviders   } from './window-ref/window-ref.service';

@NgModule({
    providers: [
        WindowRefProviders,
        DocumentRefProviders
    ]
})
export class CoreModule { }

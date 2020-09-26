import { NgModule } from '@angular/core';
import { WindowRefProviders   } from './window-ref/window-ref.service';
import { DocumentRefProviders } from './document-ref/document-ref.service';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        WindowRefProviders,
        // DocumentRefProviders
    ],
    exports: []
})
export class CoreModule { }

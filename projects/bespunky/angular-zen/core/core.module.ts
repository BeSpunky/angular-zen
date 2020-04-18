import { NgModule } from '@angular/core';
import { WindowRefProviders } from './WindowRef/window-ref.service';
import { DocumentRefProviders } from './DocumentRef/document-ref.service';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        WindowRefProviders,
        DocumentRefProviders
    ],
    exports: []
})
export class CoreModule { }

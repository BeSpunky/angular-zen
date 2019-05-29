import { NgModule } from '@angular/core';
import { WindowRefProviders } from './WindowRef/window-ref.service';
import { DocumentRef } from './DocumentRef/document-ref.service';

@NgModule({
    declarations: [],
    imports: [],
    providers: [
        WindowRefProviders,
        DocumentRef
    ]
})
export class CoreModule { }

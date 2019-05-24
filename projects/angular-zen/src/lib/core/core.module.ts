import { NgModule } from '@angular/core';
import { WindowRef } from './WindowRef/window-ref.service';
import { DocumentRef } from './DocumentRef/document-ref.service';

@NgModule({
    declarations: [],
    imports: [],
    providers: [WindowRef, DocumentRef]
})
export class CoreModule { }

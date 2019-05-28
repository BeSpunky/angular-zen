import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from 'angular-zen';

import { CoreDemoComponent } from './core-demo.component';
import { WindowRefDemoComponent } from './window-ref-demo/window-ref-demo.component';
import { DocumentRefDemoComponent } from './document-ref-demo/document-ref-demo.component';

@NgModule({
    declarations: [CoreDemoComponent, WindowRefDemoComponent, DocumentRefDemoComponent],
    imports: [
        CommonModule,
        CoreModule
    ],
    exports: [CoreDemoComponent]
})
export class CoreDemoModule { }

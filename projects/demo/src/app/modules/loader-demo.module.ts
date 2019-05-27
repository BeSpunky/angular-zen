import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoaderDemoComponent } from './loader-demo/loader-demo.component';
import { LoaderModule } from 'angular-zen';

@NgModule({
    declarations: [LoaderDemoComponent],
    imports: [
        CommonModule,
        LoaderModule
    ],
    exports: [LoaderDemoComponent]
})
export class LoaderDemoModule { }

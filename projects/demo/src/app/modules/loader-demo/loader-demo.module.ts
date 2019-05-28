import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '@bespunky/angular-zen';

import { LoaderDemoComponent } from './loader-demo.component';
import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo/lazy-script-loader-demo.component';

@NgModule({
    declarations: [LoaderDemoComponent, LazyScriptLoaderDemoComponent],
    imports: [
        CommonModule,
        LoaderModule
    ],
    exports: [LoaderDemoComponent]
})
export class LoaderDemoModule { }

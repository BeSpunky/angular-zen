import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncModule } from '@bespunky/angular-zen';

import { AsyncDemoComponent } from './async-demo.component';
import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo/lazy-script-loader-demo.component';
import { LazyStyleLoaderDemoComponent } from './lazy-style-loader-demo/lazy-style-loader-demo.component';

@NgModule({
    declarations: [AsyncDemoComponent, LazyScriptLoaderDemoComponent, LazyStyleLoaderDemoComponent],
    imports: [
        CommonModule,
        AsyncModule
    ],
    exports: [AsyncDemoComponent]
})
export class AsyncDemoModule { }

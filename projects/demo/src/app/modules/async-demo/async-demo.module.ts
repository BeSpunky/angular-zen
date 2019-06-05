import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AsyncModule } from '@bespunky/angular-zen';

import { AsyncDemoComponent } from './async-demo.component';
import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo/lazy-script-loader-demo.component';

@NgModule({
    declarations: [AsyncDemoComponent, LazyScriptLoaderDemoComponent],
    imports: [
        CommonModule,
        AsyncModule
    ],
    exports: [AsyncDemoComponent]
})
export class AsyncDemoModule { }

import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { AsyncModule } from './async/async.module';

@NgModule({
    declarations: [],
    imports: [
        CoreModule,
        AsyncModule
    ],
    exports: [
        CoreModule,
        AsyncModule
    ]
})
export class ZenModule { }

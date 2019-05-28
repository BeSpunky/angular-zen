import { NgModule } from '@angular/core';

import { CoreModule } from './core/core.module';
import { LoaderModule } from './loader/loader.module';

@NgModule({
    declarations: [],
    imports: [
        CoreModule,
        LoaderModule
    ],
    exports: [
        CoreModule,
        LoaderModule
    ]
})
export class ZenModule { }

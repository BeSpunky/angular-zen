import { NgModule } from '@angular/core';

import { CoreModule      } from '@bespunky/angular-zen/core';
import { AsyncModule     } from '@bespunky/angular-zen/async';
import { UniversalModule } from '@bespunky/angular-zen/universal';

@NgModule({
    declarations: [],
    imports: [
        CoreModule,
        AsyncModule,
        UniversalModule
    ],
    exports: [
        CoreModule,
        AsyncModule,
        UniversalModule
    ]
})
export class ZenModule { }

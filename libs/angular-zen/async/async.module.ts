import { NgModule } from '@angular/core';

import { CoreModule } from '@bespunky/angular-zen/core';
import { UniversalModule } from '@bespunky/angular-zen/universal';

@NgModule({
    declarations: [],
    imports: [ CoreModule, UniversalModule ],
    exports: [ CoreModule ]
})
export class AsyncModule { }

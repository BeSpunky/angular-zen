import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversalModule } from '@bespunky/angular-zen/universal';
import { UniversalServiceDemoComponent } from './universal-service-demo/universal-service-demo.component';
import { UniversalDemoComponent } from './universal-demo.component';

@NgModule({
    declarations: [UniversalDemoComponent, UniversalServiceDemoComponent],
    imports: [
        CommonModule,
        UniversalModule
    ],
    exports: [UniversalDemoComponent]
})
export class UniversalDemoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UniversalModule } from '@bespunky/angular-zen';
import { UniversalServiceDemoComponent } from './universal-service-demo/universal-service-demo.component';
import { UniversalDemoComponent } from './universal-demo.component';

@NgModule({
    declarations: [UniversalDemoComponent, UniversalServiceDemoComponent],
    imports: [
        CommonModule,
        UniversalModule.forRoot()
    ],
    exports: [UniversalDemoComponent]
})
export class UniversalDemoModule { }

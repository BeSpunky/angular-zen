import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreDemoModule } from './modules/core-demo/core-demo.module';
import { AsyncDemoModule } from './modules/async-demo/async-demo.module';
import { UniversalDemoModule } from './modules/universal-demo/universal-demo.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CoreDemoModule,
        AsyncDemoModule,
        UniversalDemoModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

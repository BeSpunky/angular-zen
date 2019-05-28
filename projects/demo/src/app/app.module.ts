import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { CoreDemoModule } from './modules/core-demo/core-demo.module';
import { LoaderDemoModule } from './modules/loader-demo/loader-demo.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        CoreDemoModule,
        LoaderDemoModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

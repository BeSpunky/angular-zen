import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { LoaderDemoModule } from './modules/loader-demo.module';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        LoaderDemoModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }

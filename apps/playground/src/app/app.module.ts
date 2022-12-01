import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@bespunky/angular-zen/core';
import { provideRouterX } from '@bespunky/angular-zen/router-x/navigation';

import { AppComponent } from './app.component';
import { TheaterShowComponent } from './theater-show/theater-show.component';
import { theaterRoutes } from './theater.routes';

@NgModule({
    declarations: [ AppComponent, TheaterShowComponent],
    imports: [
        BrowserModule, BrowserAnimationsModule, CoreModule,
        RouterModule
    ],
    providers: [ provideRouterX([ theaterRoutes ]) ],
    bootstrap: [ AppComponent ],
})
export class AppModule {}

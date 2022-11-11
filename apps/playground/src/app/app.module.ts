import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { CoreModule } from '@bespunky/angular-zen/core';
import { provideRouterX } from '@bespunky/angular-zen/router-x/navigator-x';

import { AppComponent } from './app.component';
import { UserProfileComponentModule } from './user-profile/user-profile.component';
import { userRoutes } from './user.routes';

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule, BrowserAnimationsModule, CoreModule, UserProfileComponentModule,
        RouterModule
    ],
    providers: [provideRouterX([userRoutes])],
    bootstrap: [AppComponent],
})
export class AppModule { }

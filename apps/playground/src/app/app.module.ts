import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '@bespunky/angular-zen/core';

import { AppComponent } from './app.component';
import { UserProfileComponentModule } from './user-profile/user-profile.component';
import { userRoutes } from './user.routes';

const routerConfig = [userRoutes] as Routes;

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule, BrowserAnimationsModule, CoreModule, UserProfileComponentModule,
        RouterModule.forRoot(routerConfig)
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule, Routes } from '@angular/router';
import { CoreModule } from '@bespunky/angular-zen/core';

import { AppComponent } from './app.component';
import { UserProfileComponent, UserProfileComponentModule } from './user-profile/user-profile.component';

const routes: Routes = [
    { path: 'user/:id/profile', component: UserProfileComponent },
    { path: '', redirectTo: 'user/1/profile', pathMatch: 'full' },
];

@NgModule({
    declarations: [AppComponent],
    imports: [
        BrowserModule, BrowserAnimationsModule, CoreModule, UserProfileComponentModule,
        RouterModule.forRoot(routes)
    ],
    providers: [],
    bootstrap: [AppComponent],
})
export class AppModule { }

/* eslint-disable @typescript-eslint/no-empty-interface */
import { Injectable } from '@angular/core';
import { AutoNavigateRouteMethods, NavigatesTo, routeConfigFor } from '@bespunky/angular-zen/router-x';
import { User } from './user-profile/model';
import { UserProfileComponent } from './user-profile/user-profile.component';

const user = routeConfigFor<User>();

export const userRoutes = user.route({
    path: 'user',
    children: [
        {
            path: ':id',
            component: UserProfileComponent,
            children: [
                {
                    path: 'profile',
                    component: UserProfileComponent
                }
            ]
        }
    ]
} as const);

export interface UserNavigation extends AutoNavigateRouteMethods<typeof userRoutes, User, ''> { }

@Injectable({ providedIn: 'root' })
@NavigatesTo(userRoutes)
export class UserNavigation //extends NavigateService
{
    s() { this.}
}
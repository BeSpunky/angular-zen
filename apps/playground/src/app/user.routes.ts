import { routeConfigFor } from '@bespunky/angular-zen/router-x';
import { User } from './user-profile/model';
import { UserProfileComponent } from './user-profile/user-profile.component';

const user = routeConfigFor<User>();

export const userRoutes = user.route({
    path: 'user',
    friendlyName: 'Pa',
    children: [
        {
            path: ':id',
            // friendlyName: 'ahaha',
            component: UserProfileComponent,
            children: [
                {
                    path: 'profile',
                    // friendlyName: 'UserProfile',
                    component: UserProfileComponent,
                    children: [
                        { path: ':birthday', component: UserProfileComponent }
                    ]
                }
            ]
        }
    ]
} as const);
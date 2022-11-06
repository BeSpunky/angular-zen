import { AutoNavigateRouteMethods, routeConfigFor } from '@bespunky/angular-zen/router-x';
import { User } from './user-profile/model';
import { UserProfileComponent } from './user-profile/user-profile.component';

const user = routeConfigFor<User>();

export const userRoutes = user.route({
    path: 'user',
    friendlyName: 'hhhhhh',
    children: [
        {
            path: ':id',
            component: UserProfileComponent,
            // children: [
            //     {
            //         path: 'profile',
            //         friendlyName: 'UserProfile',
            //         component: UserProfileComponent
            //     }
            // ]
        }
    ]
} as const);
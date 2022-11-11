import { routeConfigFor } from '@bespunky/angular-zen/router-x/navigator-x';
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
                    component: UserProfileComponent,
                    children: [
                        { path: ':birthday', component: UserProfileComponent }
                    ]
                }
            ]
        }
    ]
} as const);
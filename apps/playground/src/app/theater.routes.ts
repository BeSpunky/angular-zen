import { routeConfigFor } from '@bespunky/angular-zen/router-x/navigator-x';
import { Show } from './theater-show/model';
import { TheaterShowComponent } from './theater-show/theater-show.component';

const theater = routeConfigFor<Show>();

export const theaterRoutes = theater.route({
    path: 'theaters',
    children: [
        {
            path: ':theaterId',
            component: TheaterShowComponent,
            children: [
                {
                    path: 'shows',
                    component: TheaterShowComponent,
                    children: [
                        { path: ':id', component: TheaterShowComponent }
                    ]
                }
            ]
        }
    ]
} as const);
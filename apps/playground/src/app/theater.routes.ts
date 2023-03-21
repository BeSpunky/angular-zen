import { routeConfigFor } from '@bespunky/angular-zen/router-x/navigation';
import { TheaterShowComponent } from './theater-show/theater-show.component';
import { TheaterShow } from './theater-show/model';

const theater = routeConfigFor<TheaterShow>();

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
                        { path: ':id', friendlyName: 'ShowDetails', component: TheaterShowComponent }
                    ]
                }
            ]
        }
    ]
} as const);
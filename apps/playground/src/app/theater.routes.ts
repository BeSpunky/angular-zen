import { path, routeConfigFor } from '@bespunky/angular-zen/router-x/navigation';
import { TheaterShowComponent } from './theater-show/theater-show.component';
import { TheaterShow } from './theater-show/model';
import { TheatersComponent } from './theaters/theaters.component';
import { TheaterDetailsComponent } from './theater-details/theater-details.component';
import { TheaterShowsComponent, TheaterShowsFilter } from './theater-shows/theater-shows.component';

// theater.routes.ts
const theater = routeConfigFor<TheaterShow>();

export const theaterRoutes = theater.route({
    path: 'theaters',
    component: TheatersComponent,
    children: [
        {
            path: ':theaterId',
            component: TheaterDetailsComponent,
            children: [
                {
                    path: path('shows').withQuery<TheaterShowsFilter>(),
                    friendlyName: 'TheaterShows',
                    component: TheaterShowsComponent,
                    children: [
                        {
                            path: ':id', friendlyName: 'ShowDetails', component: TheaterShowComponent
                        }
                    ]
                }
            ]
        }
    ]
} as const);

export type TheaterRoutes = typeof theaterRoutes;
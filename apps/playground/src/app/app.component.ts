import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { useNavigationX } from '@bespunky/angular-zen/router-x/navigation';
import { theaterRoutes } from './theater.routes';

@Component({
    standalone : true,
    selector   : 'bs-playground-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
    imports    : [RouterModule]
})
export class AppComponent
{
    private readonly navigate = useNavigationX(theaterRoutes);

    onSomeEvent(theaterId: string): void
    {
        this.navigate.toTheaters();
        this.navigate.toTheatersTheaterId({ theaterId: 2 });
        this.navigate.toTheaterShows({ theaterId: 2}, { queryParams: { toolbar: true }});
        this.navigate.toShowDetails({ theaterId: 8, id: 1 })
    }
}
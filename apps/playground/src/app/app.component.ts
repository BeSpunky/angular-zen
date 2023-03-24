import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
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

    constructor(private readonly router: Router) {}
    
    onSomeEvent(theaterId: string, showId: number): void
    {
        this.router.navigate<typeof theaterRoutes>(['theeters', theaterId, 'shows']);

        this.navigate.toShowDetails({ id: showId, theaterId });
    }
}
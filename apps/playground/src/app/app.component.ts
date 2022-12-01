import { Component } from '@angular/core';
import { useNavigationX } from '@bespunky/angular-zen/router-x/navigation';
import { theaterRoutes } from './theater.routes';

@Component({
    selector   : 'bs-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
})
export class AppComponent
{
    private readonly navigate = useNavigationX(theaterRoutes);

    onSomeEvent(theaterId: string, showId: number): void
    {
        this.navigate.toShowDetails({ id: showId, theaterId: +theaterId });
    }
}

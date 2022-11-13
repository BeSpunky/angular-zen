import { Component } from '@angular/core';
import { useNavigationX } from '@bespunky/angular-zen/router-x/navigator-x';
import { NotificationsService } from './notifications.service';
import { theaterRoutes } from './theater.routes';

@Component({
    selector   : 'bs-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
})
export class AppComponent
{
    private readonly navigate = useNavigationX(theaterRoutes);

    constructor(public readonly notifications: NotificationsService) { }

    onSomethingHappened(theaterId: string): void
    {
        this.navigate.toTheatersTheaterId({ theaterId });
    }
}

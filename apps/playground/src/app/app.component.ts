import { Component } from '@angular/core';
import { useNavigationX } from '@bespunky/angular-zen/router-x/navigator-x';
import { NotificationsService } from './notifications.service';
import { userRoutes } from './user.routes';

@Component({
    selector   : 'bs-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss'],
})
export class AppComponent
{
    private readonly navigate = useNavigationX(userRoutes);

    constructor(public readonly notifications: NotificationsService) { }

    doTheDance(id: string): void
    {
        this.navigate.toUserIdProfileBirthday({ id, birthday: new Date() });
    }
}

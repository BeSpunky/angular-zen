import { trigger, transition, style, animate } from '@angular/animations';
import { Component } from "@angular/core";
import { NotificationsService } from './notifications.service';

const grow = trigger('grow', [
    transition(':enter', [
        style({ opacity: 0, transform: 'scale(0)' }),
       animate('0.5s cubic-bezier(.01,1.02,.44,1.13)', style({ opacity: 1, transform: 'scale(1)' })),
    ]),
    transition(':leave', [
        style({ opacity: 1, transform: 'scale(1)' }),
       animate('0.5s cubic-bezier(.01,1.02,.44,1.13)', style({ opacity: 0, transform: 'scale(0)' })),
    ]),
]);

@Component({
    selector   : "bespunky-root",
    templateUrl: "./app.component.html",
    styleUrls  : ["./app.component.scss"],
    animations : [grow]
})
export class AppComponent
{
    constructor(public readonly notifications: NotificationsService) { }
}

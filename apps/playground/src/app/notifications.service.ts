import { timer, map, Observable, concatMap, of, delay, range } from 'rxjs';
import { Injectable } from '@angular/core';

export interface Notification
{
    message: string;
    type   : 'info' | 'warning' | 'party'
}

@Injectable({ providedIn: 'root' })
export class NotificationsService
{
    private readonly birthdayMessages: Notification[] = [
        { message: `🥳 It's your birthday!`, type: 'party' } as const,
        { message: `🥳 It's my birthday!`, type: 'party' } as const,
    ];

    private readonly systemMessages: Notification[] = [
        { message: `🚀 Angular-zen v5.0.0 is out! 🙌`, type: 'info' } as const,
        { message: `✅ Download completed.`, type: 'info' } as const,
        { message: `🛡️ Someone has logged in.`, type: 'warning' } as const,
    ];

    public readonly birthdays = this.createFeed(this.birthdayMessages);
    public readonly system    = this.createFeed(this.systemMessages);

    private createFeed(collection: Notification[]): Observable<Notification>
    {
        const random = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

        return range(1, 100).pipe(
            concatMap(i => of(i).pipe(delay(random(2500, 7000)))),
            map(i => collection[i % collection.length])
        );
    }
}
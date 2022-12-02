import { inject, Type } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { defer, filter } from 'rxjs';

export function useRouterEvents(...eventTypes: Type<RouterEvent>[]): Router[ 'events' ]
{
    return defer(() =>
        inject(Router)
            .events
            .pipe(
                filter((event) =>
                    eventTypes.some(eventType => event instanceof eventType))
            )
    );
}
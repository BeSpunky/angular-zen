import { inject, Type } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';
import { defer, filter, Observable } from 'rxjs';

export function useRouterEvent<T extends RouterEvent>(eventType: Type<T>): Observable<T>
{
    return defer(() =>
        inject(Router)
            .events
            .pipe(
                filter((event) => event instanceof eventType),
            ) as Observable<T>
    );
}
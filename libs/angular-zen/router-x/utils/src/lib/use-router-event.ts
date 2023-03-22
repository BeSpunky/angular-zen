import { filter, Observable } from 'rxjs';
import { inject, Type } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

/**
 * Creates an observable which emits only the specified routing event.
 *
 * @export
 * @template T The type of router event to observe.
 * @param {Type<T>} eventType The type of router event to observe.
 * @return {Observable<T>} An observable which emits only the specified routing event.
 */
export function useRouterEvent<T extends RouterEvent>(eventType: Type<T>): Observable<T>
{
    const router = inject(Router);

    return router.events.pipe(
        filter((event): event is T => event instanceof eventType),
    );
}

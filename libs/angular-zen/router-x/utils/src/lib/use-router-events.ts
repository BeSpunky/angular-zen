import { filter, Observable } from 'rxjs';
import { inject, Type } from '@angular/core';
import { Router, RouterEvent } from '@angular/router';

type TypeInstance<T extends Type<any>> = T extends Type<infer Instance> ? Instance : never;

/**
 * Creates an observable which emits only the specified router events.
 *
 * @export
 * @param {readonly [...Events]} eventTypes 
 * @template Events The types of events to observe.
 * @returns {Observable<TypeInstance<Events[number]>>} An observable which emits only the specified router events.
 */
export function useRouterEvents<Events extends readonly Type<RouterEvent>[]>(...eventTypes: readonly [...Events]): Observable<TypeInstance<Events[number]>>
{
    return inject(Router).events.pipe(
        filter((event): event is TypeInstance<Events[number]> => eventTypes.some(eventType => event instanceof eventType))
    );
}
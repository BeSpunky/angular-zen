import { map, merge, Observable, shareReplay } from 'rxjs';
import { inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { RouterOutletComponentBus } from '@bespunky/angular-zen/router-x';
import { AnyObject } from '@bespunky/typescript-utils';
import { useRouterEvent } from './use-router-event';

/**
 * Creates an observable which emits the latest state of the published router outlets in the app.
 * The emitted state is a dictionary of outlet names and corresponding component instances.
 *
 * @see `PublishComponentDirective` for more details.
 * 
 * @export
 * @return {Observable<Map<string, AnyObject | null>>} An observable which emits the latest state of the published router outlets in the app.
 */
export function useRouterOutletStateTracker(): Observable<Map<string, AnyObject | null>>
{
    const componentBus = inject(RouterOutletComponentBus);

    return merge([componentBus.componentPublished, componentBus.componentUnpublished]).pipe(
        map(() => componentBus.outletsState),
        shareReplay(1)
    );
}

export type ActivatedRouteWithComponent = {
    component: AnyObject | null;
    route    : ActivatedRouteSnapshot;
};

/**
 * Creates an observable which emits the latest component instance for the currently activated route.
 * 
 * @see `PublishComponentDirective` for more details.
 *
 * @export
 * @return {Observable<ActivatedRouteWithComponent>} An observable which emits the component instance for the currently activated route.
 */
export function useActivatedRouteComponent(): Observable<ActivatedRouteWithComponent>
{
    const componentBus = inject(RouterOutletComponentBus);
    const route        = inject(ActivatedRoute);

    return useRouterEvent(NavigationEnd).pipe(
        map(() => ({
            component: componentBus.instance(route.outlet),
            route    : route.snapshot
        } as ActivatedRouteWithComponent)),
        shareReplay(1)
    );
}

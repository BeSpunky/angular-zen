import { inject } from '@angular/core';
import { _NavigatorXToken_ } from './_navigator-x.symbols';
import type { AutoNavigateRouteMethods } from './types/auto-navigator-methods.types';
import type { WithNavigationX, ReadonlyRoute, WithRouteComposer, DeepReadonlyRouteChildren } from './types/composable-routes.types';
import type { routeConfigFor } from './navigator-x.route-creator';
import type { provideRouterX, provideRoutesX } from './navigator-x.providers';

/**
 * Injects the auto-generated strongly-typed navigation service for the specified route tree.
 * 
 * For this to work, the route must be previously generated using {@link routeConfigFor `routeConfigFor`}, and provided into Angular using
 * either {@link provideRouterX `provideRouterX`} or {@link provideRoutesX `provideRoutesX`}.
 *
 * To change the default composed name of a specific auto-generated navigation method, go to the corresponding
 * route config and add the `friendlyName` propertyName.
 * 
 * @export
 * @template Route 
 * @template Entity 
 * @template Root 
 * @template FullPath 
 * @template ComposerName 
 * @param {(Route & WithRouteComposer<Entity, FullPath, ComposerName> & WithNavigationX<Route, Entity, Root>)} route 
 * @return {AutoNavigateRouteMethods<Route, Entity, Root>} 
 */
export function useNavigationX<
    Route extends ReadonlyRoute<string, string, DeepReadonlyRouteChildren>,
    Entity,
    Root extends string,
    FullPath extends string,
    ComposerName extends string
>(route: Route & WithRouteComposer<Entity, FullPath, ComposerName> & WithNavigationX<Route, Entity, Root>): AutoNavigateRouteMethods<Route, Entity, Root>
{
    return inject(route[ _NavigatorXToken_ ]);
}

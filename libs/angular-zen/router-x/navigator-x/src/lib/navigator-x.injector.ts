import { inject } from '@angular/core';
import { AutoNavigateRouteMethods } from './types/auto-navigator-methods.types';
import { WithNavigationX, ReadonlyRoute, WithRouteComposer, _NavigatorXToken_ } from './types/composable-routes.types';

export function useNavigationX<
    Route extends ReadonlyRoute<string, string, any>,
    Entity,
    Root extends string,
    FullPath extends string,
    ComposerName extends string
>(route: Route & WithRouteComposer<Entity, FullPath, ComposerName> & WithNavigationX<Route, Entity, Root>): AutoNavigateRouteMethods<Route, Entity, Root>
{
    return inject(route[ _NavigatorXToken_ ]);
}

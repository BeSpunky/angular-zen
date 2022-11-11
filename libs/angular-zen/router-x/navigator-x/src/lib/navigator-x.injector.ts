import { inject } from '@angular/core';
import { AutoNavigateRouteMethods } from './types/auto-navigator-methods.types';
import { NavigatorXRoute, ReadonlyRoute, ReadonlyRouteChildren, ReadonlyRouteComposer, _NavigatorXToken_ } from './types/composable-routes.types';

export function useNavigationX<
    Route extends ReadonlyRoute<string, string> & ReadonlyRouteChildren<any>,
    Entity,
    Root extends string,
    FullPath extends string,
    ComposerName extends string
>(route: Route & ReadonlyRouteComposer<Entity, FullPath, ComposerName> & NavigatorXRoute<Route, Entity, Root>): AutoNavigateRouteMethods<Route, Entity, Root>
{
    return inject(route[ _NavigatorXToken_ ]);
}

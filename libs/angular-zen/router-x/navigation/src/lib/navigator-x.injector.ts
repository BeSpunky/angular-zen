import { inject } from '@angular/core';
import { _NavigatorXToken_ } from './_navigator-x.symbols';
import type { AutoNavigateRouteMethods } from './types/auto-navigator-methods.types';
import type { WithNavigationX, ReadonlyRoute, WithRouteComposer, DeepReadonlyRouteChildren } from './types/composable-routes.types';

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

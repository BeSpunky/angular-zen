import { InjectionToken } from '@angular/core';
import type { Join, NoTail } from '@bespunky/typescript-utils';

import { RouteComposer } from './route-composer/router-composer';
import { firstUpper } from './_utils/_string-utils';
import { _NavigatorXToken_, _RouteComposer_ } from './_navigation-x.symbols';

import type { AutoNavigateRouteMethods } from './types/auto-navigator-methods.types';
import type { ComposableRoute, ComposableRoutesArray, DeepReadonlyRouteChildren, ReadonlyRoute, WithNavigationX } from './types/composable-routes.types';
import type { GeneratedRouteComposerName, RouteComposerName } from './types/route-composer.types';
import type { CombinedPath, RouteSegments } from './types/route-paths.types';

export const autoNavigatorNameSeparator = '';

function generateRouteComposerName<Path extends string>(path: Path): GeneratedRouteComposerName<Path>
{
    return path
        .replace(/\/:/g, '/')
        .split('/')
        .map(firstUpper)
        .join(autoNavigatorNameSeparator) as GeneratedRouteComposerName<Path>;
}

interface RouteConfigurator<Entity, QueryParamsEntity>
{
    /**
     * Generates a strongly-typed navigation-x route.
     * Pass the result to either `provideRouterX()` or `provideRoutesX()` and you'll be able to call `useNavigationX()`
     * with the route tree you specified.
     *
     * ❕ Remember to pass the route config `as const`.
     * 
     * @template Segment The strong-typed path property of the route segment.
     * @template FriendlyName The strong-typed friendly name for the route segment. Taken from the `friendlyName` proeprty.
     * @template Children The strong-typed children of the route segment.
     * @param {ReadonlyRoute<Segment, FriendlyName, Children>} route The route config to strong-type. Remember to pass it in use `as const`.
     * @return  
     */
     route: <
        Segment extends string,
        FriendlyName extends string,
        Children extends DeepReadonlyRouteChildren | undefined
    >(route: ReadonlyRoute<Segment, FriendlyName, Children>) =>
        ComposableRoute<typeof route, Entity, ''> & WithNavigationX<typeof route, Entity, ''>;
    
    /**
     * Generates a strongly-typed navigation-x route with a predefined path prefix.
     * Pass the result to either `provideRouterX()` or `provideRoutesX()` and you'll be able to call `useNavigationX()`
     * with the route tree you specified.
     *
     * ❕ Remember to pass the route config `as const`.
     * 
     * @template Segment The strong-typed path property of the route segment.
     * @template FriendlyName The strong-typed friendly name for the route segment. Taken from the `friendlyName` proeprty.
     * @template Children The strong-typed children of the route segment.
     * @template Root The strong-typed url prefix for all routes in the tree.
     * @param {ReadonlyRoute<Segment, FriendlyName, Children>} route The route config to strong-type. Remember to pass it in use `as const`.
     * @param {Root} root The url prefix all routes in this config tree start from.
     * @return  
     */
    prefixedRoute: <
        Segment extends string,
        FriendlyName extends string,
        Children extends DeepReadonlyRouteChildren | undefined,
        Root extends string
    >(route: ReadonlyRoute<Segment, FriendlyName, Children>, root: Root) => 
        ComposableRoute<typeof route, Entity, Root> & WithNavigationX<typeof route, Entity, Join<NoTail<RouteSegments<Root>> & string[], '/'>>;
}

/**
 * Creates a strongly-typed configurator for Angular routes.
 * 
 * Call this with an entity, then generate a strongly typed Angular route config tree using one of the
 * configurator's functions.
 * 
 * Store the generated route somewhere and use `provideRouterX()` or `provideRoutesX()` to tell Angular about it.
 *
 * @export
 * @template Entity The entity (or data structure) route arguments should match with.
 * @return {RouteConfigurator<Entity>} An object which allows generating strongly typed routes.
 */
export function routeConfigFor<Entity, QueryParamsEntity = Entity>(): RouteConfigurator<Entity, QueryParamsEntity>
{
    function combinePath<Root extends string, Segment extends string>(root: Root, segment?: Segment)
    {
        return (segment ? `${ root }/${ segment }` : root) as CombinedPath<Root, Segment>;
    }

    function prefixedRouteCore<
        Segment      extends string,
        FriendlyName extends string,
        Children     extends DeepReadonlyRouteChildren | undefined,
        Root         extends string
    >(route: ReadonlyRoute<Segment, FriendlyName, Children>, root: Root)//: ComposableRoute<typeof route, Entity, CombinedPath<Root, Segment>>
    {
        const path         = combinePath(root, route.path) as CombinedPath<Root, Segment>;
        const composerName = (route.friendlyName ?? generateRouteComposerName(path)) as RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>;

        const composer = new RouteComposer<Entity, CombinedPath<Root, Segment>, RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>>(path, composerName);
        const children = route.children?.map(child => prefixedRoute(child, path)) as
                            ComposableRoutesArray<Children, Entity, CombinedPath<Root, Segment>> | undefined;

        return {
            ...route,
            children,
            [_RouteComposer_]: composer
        } as const;
    }

    function prefixedRoute<
        Segment      extends string,
        FriendlyName extends string,
        Children     extends DeepReadonlyRouteChildren | undefined,
        Root         extends string
    >(route: ReadonlyRoute<Segment, FriendlyName, Children>, root: Root)//: ComposableRootRoute<ComposableRoute<typeof route, Entity, CombinedPath<Root, Segment>>>
    {
        return {
            ...prefixedRouteCore(route, root),
            [ _NavigatorXToken_ ]: new InjectionToken<AutoNavigateRouteMethods<typeof route, Entity, Root>>(`_ROUTER_X_NAVIGATION__${ route.path }`)
        } as const;
    }

    function route<
        Segment      extends string,
        FriendlyName extends string,
        Children     extends DeepReadonlyRouteChildren | undefined
    >(route: ReadonlyRoute<Segment, FriendlyName, Children>)//: ComposableRootRoute<ComposableRoute<typeof route, Entity, CombinedPath<'', Segment>>>
    {
        // When the `root` arg was optional with a default value of `''`, TS appended `${string}` (e.g. `${string}/theaters/:theaterId`)
        // to the route template for some reason, which breaks the arg extraction later on.
        // Passing `''` manually however, leaves the template as is should be (e.g. `/theaters/:theaterId`) and allows the string template to be interpreted well.
        // `route()` and `prefixedRoute()` were seperated to allow the developer to call `route()` without providing `''`.
        // The `prefixedRoute()` is exposed to the world as it might be usefull in the future (e.g. lazy loaded routes? maybe...?)
        return prefixedRoute(route, '');
    }

    return {
        route,
        prefixedRoute
    } as RouteConfigurator<Entity, QueryParamsEntity>;
}


import { InjectionToken } from '@angular/core';
import { RouteComposer } from './route-composer/router-composer';
import { firstUpper } from './_utils/_string-utils';
import { _NavigatorXToken_, _RouteComposer_ } from './_navigator-x.symbols';

import type { AutoNavigateRouteMethods } from './types/auto-navigator-methods.types';
import type { ComposableRoute, ComposableRoutesArray, ReadonlyRoute, WithNavigationX } from './types/composable-routes.types';
import type { GeneratedRouteComposerName, RouteComposerName } from './types/route-composer.types';
import type { CombinedPath, RouteSegments } from './types/route-paths.types';
import type { NoTail } from './types/_arrays.types';
import type { Join } from './types/_strings.types';

const autoNavigatorNameSeparator = '';

function generateRouteComposerName<Path extends string>(path: Path): GeneratedRouteComposerName<Path>
{
    return path
        .replace(/\/:/g, '/')
        .split('/')
        .map(firstUpper)
        .join(autoNavigatorNameSeparator) as GeneratedRouteComposerName<Path>;
}

interface RouteConfigurator<Entity>
{
    route: <
        Segment extends string,
        FriendlyName extends string,
        Children extends readonly ReadonlyRoute<string, string, any>[]
    >(route: ReadonlyRoute<Segment, FriendlyName, Children>) =>
        ComposableRoute<typeof route, Entity, ''> & WithNavigationX<typeof route, Entity, ''>;
    
    prefixedRoute: <
        Segment extends string,
        FriendlyName extends string,
        Children extends readonly ReadonlyRoute<string, string, any>[],
        Root extends string
    >(route: ReadonlyRoute<Segment, FriendlyName, Children>, root: Root) => 
        ComposableRoute<typeof route, Entity, Root> & WithNavigationX<typeof route, Entity, Join<NoTail<RouteSegments<Root>> & string[], '/'>>;
}

export function routeConfigFor<Entity>(): RouteConfigurator<Entity>
{
    function combinePath<Root extends string, Segment extends string>(root: Root, segment?: Segment)
    {
        return (segment ? `${ root }/${ segment }` : root) as CombinedPath<Root, Segment>;
    }

    function prefixedRouteCore<
        Segment      extends string,
        FriendlyName extends string,
        Children     extends readonly ReadonlyRoute<string, string, any>[],
        Root         extends string
    >(route: ReadonlyRoute<Segment, FriendlyName, Children>, root: Root)//: ComposableRoute<typeof route, Entity, CombinedPath<Root, Segment>>
    {
        const path         = combinePath(root, route.path) as CombinedPath<Root, Segment>;
        const composerName = (route.friendlyName ?? generateRouteComposerName(path)) as RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>;

        const composer = new  RouteComposer<Entity, CombinedPath<Root, Segment>, RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>>(path, composerName);
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
        Children     extends readonly ReadonlyRoute<string, string, any>[],
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
        Children     extends readonly ReadonlyRoute<string, string, any>[]
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
    } as RouteConfigurator<Entity>;
}


import { InjectionToken } from '@angular/core';
import { RouteComposer } from './route-composer/router-composer';
import { AutoNavigateRouteMethods } from './types/auto-navigator-methods.types';
import { ComposableRoutesArray, ReadonlyRoute, ReadonlyRouteChildren, _NavigatorXToken_, _RouteComposer_ } from './types/composable-routes.types';
import { GeneratedRouteComposerName, RouteComposerName } from './types/route-composer.types';
import { CombinedPath } from './types/route-paths.types';
import { firstUpper } from './_utils/_string-utils';

const autoNavigatorNameSeparator = '';

function generateRouteComposerName<Path extends string>(path: Path): GeneratedRouteComposerName<Path>
{
    return path
        .replace(/\/:/g, '/')
        .split('/')
        .map(firstUpper)
        .join(autoNavigatorNameSeparator) as GeneratedRouteComposerName<Path>;
}

export function routeConfigFor<Entity>()
{
    function combinePath<Root extends string, Segment extends string>(root: Root, segment?: Segment)
    {
        return (segment ? `${ root }/${ segment }` : root) as CombinedPath<Root, Segment>;
    }

    function createFullRoutePath<
        Route    extends ReadonlyRoute<Segment, string>,
        Segment  extends string,
        Root     extends string,
        FullPath extends CombinedPath<Root, Segment>
    >(tree: Route, root: Root): FullPath
    {
        return combinePath(root, tree.path) as FullPath;
    }

    function createComposableChildrenRecursively<
        Route    extends ReadonlyRoute<Segment, string> & ReadonlyRouteChildren<Children>,
        Segment  extends string,
        Children extends readonly ReadonlyRoute<string, string>[],
        Root     extends string,
        FullPath extends CombinedPath<Root, Segment>
    >(tree: Route, path: FullPath)
    {
        return tree.children?.map(child => prefixedRoute(child, path)) as
            ComposableRoutesArray<Children, Entity, FullPath> | undefined;
    }

    function createRouteComposer<
        Route        extends ReadonlyRoute<string, FriendlyName>,
        FriendlyName extends string,
        FullPath     extends string,
        ComposerName extends RouteComposerName<FriendlyName, FullPath>
    >(tree: Route, path: FullPath): RouteComposer<Entity, FullPath, ComposerName>
    {
        const composerName = (tree.friendlyName ?? generateRouteComposerName(path)) as ComposerName;

        return new RouteComposer<Entity, FullPath, ComposerName>(path, composerName);
    }

    function prefixedRouteCore<
        Segment      extends string,
        FriendlyName extends string,
        Children     extends readonly ReadonlyRoute<string, string>[],
        Root         extends string
    >(route: ReadonlyRoute<Segment, FriendlyName> & ReadonlyRouteChildren<Children>, root: Root)//: ComposableRoute<typeof route, Entity, CombinedPath<Root, Segment>>
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
        Children     extends readonly ReadonlyRoute<string, string>[],
        Root         extends string
    >(route: ReadonlyRoute<Segment, FriendlyName> & ReadonlyRouteChildren<Children>, root: Root)//: ComposableRootRoute<ComposableRoute<typeof route, Entity, CombinedPath<Root, Segment>>>
    {
        return {
            ...prefixedRouteCore(route, root),
            [ _NavigatorXToken_ ]: new InjectionToken<AutoNavigateRouteMethods<typeof route, Entity, Root>>(`_ROUTER_X_NAVIGATION__${ route.path }`)
        } as const;
    }

    function route<
        Segment      extends string,
        FriendlyName extends string,
        Children     extends readonly ReadonlyRoute<string, string>[]
    >(route: ReadonlyRoute<Segment, FriendlyName> & ReadonlyRouteChildren<Children>)//: ComposableRootRoute<ComposableRoute<typeof route, Entity, CombinedPath<'', Segment>>>
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
    };
}


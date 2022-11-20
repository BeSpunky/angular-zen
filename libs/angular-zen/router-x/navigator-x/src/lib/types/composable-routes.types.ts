import type { InjectionToken } from '@angular/core';
import type { Route } from '@angular/router';
import type { _NavigatorXToken_, _RouteComposer_ } from '../_navigator-x.symbols';
import type { RouteComposer } from '../route-composer/router-composer';
import type { AutoNavigateRouteMethods } from './auto-navigator-methods.types';
import type { RouteComposerName } from './route-composer.types';
import type { CombinedPath, RouteSegments } from './route-paths.types';
import type { NoTail } from './_arrays.types';
import type { Join } from './_strings.types';

export interface ReadonlyRoute<PathSegment extends string, FriendlyName extends string, Children extends DeepReadonlyRouteChildren | undefined> extends Readonly<Omit<Route, 'path' | 'children'>>
{
    readonly friendlyName?: FriendlyName;
    readonly path?: PathSegment;
    readonly children?: Children;
}

type MaxRouteChildrenDepth = 15;

export type DeepReadonlyRouteChildren<Depth extends number = MaxRouteChildrenDepth, Levels extends Array<boolean> = []> =
    readonly ReadonlyRoute<
        string,
        string,
        Levels[ 'length' ] extends Depth ? any : DeepReadonlyRouteChildren<Depth, [ ...Levels, true ]>
    >[];

export interface WithRouteComposer<Entity, FullPath extends string, Name extends string>
{
    readonly [ _RouteComposer_ ]: RouteComposer<Entity, FullPath, Name>;
}

export interface WithNavigationX<Route, Entity, Root extends string> {
    readonly [ _NavigatorXToken_ ]: InjectionToken<AutoNavigateRouteMethods<Route, Entity, Root>>;
};

export type ComposableRoutesArray<RouteArray, Entity, Root extends string> =
    RouteArray extends readonly [ infer First, ...infer Rest ] ?
    First extends ReadonlyRoute<infer Segment, string, infer Children> ?
    readonly [
        ComposableRoute<First, Entity, CombinedPath<Root, Segment>>,
        ...ComposableRoutesArray<Rest, Entity, Root>
    ]
    : [] : [];

export type ComposableRoute<Route extends ReadonlyRoute<string, string, DeepReadonlyRouteChildren | undefined>, Entity, Root extends string> =
    Route extends ReadonlyRoute<infer Segment, infer FriendlyName, infer Children> ?
    & ReadonlyRoute<Segment, FriendlyName, Children>
    // & { readonly children?: ComposableRoutesArray<Children, Entity, CombinedPath<Root, Segment>>; }
    & WithRouteComposer<Entity, CombinedPath<Root, Segment>, RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>>
    : never;

export type ComposableRootRoute<ComposableR extends ComposableRoute<any, any, string>> =
    ComposableR extends ComposableRoute<infer Route, infer Entity, infer Root> ?
    & ComposableR
    & WithNavigationX<Route, Entity, Join<NoTail<RouteSegments<Root>> & string[], '/'>>
    : never;
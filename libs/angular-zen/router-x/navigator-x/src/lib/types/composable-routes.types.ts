import { InjectionToken } from '@angular/core';
import { Route } from '@angular/router';
import { RouteComposer } from '../route-composer/router-composer';
import { AutoNavigateRouteMethods } from './auto-navigator-methods.types';
import { RouteComposerName } from './route-composer.types';
import { CombinedPath, RouteSegments } from './route-paths.types';
import { NoTail } from './_arrays.types';
import { Join } from './_strings.types';

export const _RouteComposer_ = Symbol('RouteComposer');
export const _NavigatorXToken_ = Symbol('NavigatorXToken');

export interface ReadonlyRoute<PathSegment extends string, FriendlyName extends string, Children extends readonly ReadonlyRoute<string, string, any>[] | undefined> extends Readonly<Omit<Route, 'path' | 'children'>>
{
    readonly friendlyName?: FriendlyName;
    readonly path?: PathSegment;
    readonly children?: Children;
}

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

export type ComposableRoute<Route extends ReadonlyRoute<string, string, any>, Entity, Root extends string> =
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
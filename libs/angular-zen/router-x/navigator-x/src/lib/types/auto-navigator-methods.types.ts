import { Router } from '@angular/router';
import { EmptyObject } from './_utils.types';
import { RouteArgument, CombinedPath } from './route-paths.types';
import { ReadonlyRoute, ReadonlyRouteChildren } from './composable-routes.types';
import { EntityRouteArgs, RouteComposerName } from './route-composer.types';

export type RouteOperationMethod<Entity, Path extends string, ReturnType> =
    RouteArgument<Path> extends never
    ? () => ReturnType
    : (entity: EntityRouteArgs<Entity, Path>) => ReturnType;

export type AutoNavigateMethodName<Name extends string> = `to${ Capitalize<Name> }`;

export type AutoNavigateMethod<Entity, FullPath extends string> = RouteOperationMethod<Entity, FullPath, ReturnType<Router[ 'navigateByUrl' ]>>;

export type AutoNavigateRouteMethods<Route, Entity, Root extends string> =
    Route extends ReadonlyRoute<infer Segment, infer FriendlyName> & ReadonlyRouteChildren<infer Children> ?
        & { [ k in AutoNavigateMethodName<RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>> ]: AutoNavigateMethod<Entity, CombinedPath<Root, Segment>>; }
        & AutoNavigateRouteArrayMethods<Children, Entity, CombinedPath<Root, Segment>>
    : EmptyObject;

export type AutoNavigateRouteArrayMethods<Routes, Entity, Root extends string> =
    Routes extends readonly [ infer Route, ...infer Rest ] ?
    & AutoNavigateRouteMethods<Route, Entity, Root>
    & AutoNavigateRouteArrayMethods<Rest, Entity, Root>
    : EmptyObject;

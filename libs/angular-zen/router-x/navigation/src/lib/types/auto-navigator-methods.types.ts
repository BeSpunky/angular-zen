import type { Router } from '@angular/router';
import type { Narrow } from '@bespunky/typescript-utils';
import type { RouteArgument, CombinedPath } from './route-paths.types';
import type { ReadonlyRoute } from './composable-routes.types';
import type { EntityRouteArgs, RouteComposerName } from './route-composer.types';

export type RouteOperationMethod<Entity, Path extends string, ReturnType> =
    RouteArgument<Path> extends never
    ? () => ReturnType
    : (entity: EntityRouteArgs<Entity, Path>) => ReturnType;

type AutoNavigateMethodName<Name extends string> = `to${ Capitalize<Name> }`;

type AutoNavigateMethod<Entity, FullPath extends string> = RouteOperationMethod<Entity, FullPath, ReturnType<Router[ 'navigateByUrl' ]>>;

type AutoNavigateObjectFor<Segment extends string, FriendlyName extends string, Entity, Root extends string> =
    { [ k in AutoNavigateMethodName<RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>> ]: AutoNavigateMethod<Entity, CombinedPath<Root, Segment>>; };

export type AutoNavigateRouteMethods<Route, Entity, Root extends string> =
    Route extends ReadonlyRoute<infer Segment, infer FriendlyName, infer Children> ?
    Children extends undefined
    ? AutoNavigateObjectFor<Segment, FriendlyName, Entity, Root>
    : Narrow<
        & AutoNavigateObjectFor<Segment, FriendlyName, Entity, Root>
        & AutoNavigateRouteArrayMethods<Children, Entity, CombinedPath<Root, Segment>>
    > : never;

export type AutoNavigateRouteArrayMethods<Routes, Entity, Root extends string> =
    Routes extends readonly [ infer Route ] ? AutoNavigateRouteMethods<Route, Entity, Root> :
    Routes extends readonly [ infer Route, ...infer Rest ] ?
    & AutoNavigateRouteMethods<Route, Entity, Root>
    & AutoNavigateRouteArrayMethods<Rest, Entity, Root>
    : never;

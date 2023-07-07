import type { Router } from '@angular/router';
import type { Narrow } from '@bespunky/typescript-utils';
import type { RouteArgument, CombinedPath, RoutePathSegment, QueryEntityOf, SegmentOf, RoutePathWithQuery, RoutePath, __QueryEntity__ } from './route-paths.types';
import type { ReadonlyRoute } from './composable-routes.types';
import type { EntityRouteArgs, RouteComposerName } from './route-composer.types';

export type RouteOperationOptions<Path extends RoutePathSegment> = {
    queryParams?: QueryEntityOf<Path>;
};

type RouteOperationNoArgs<Path extends RoutePathSegment, ReturnType> =
    // This condition should be expanded if new options are added to the `RouteOperationOptions` type.
    QueryEntityOf<Path> extends never
    ? () => ReturnType
    : (options?: RouteOperationOptions<Path>) => ReturnType;

type RouteOperationWithArgs<Entity, Path extends RoutePathSegment, ReturnType> =
    (entity: EntityRouteArgs<Entity, SegmentOf<Path>>, ...more: Parameters<RouteOperationNoArgs<Path, ReturnType>>) => ReturnType;

export type RouteOperationMethod<Entity, Path extends RoutePathSegment, ReturnType> =
    RouteArgument<SegmentOf<Path>> extends never
    ? RouteOperationNoArgs<Path, ReturnType>
    : RouteOperationWithArgs<Entity, Path, ReturnType>;

type AutoNavigateMethodName<Name extends string> = `to${ Capitalize<Name> }`;

type AutoNavigateMethod<Entity, FullPath extends RoutePathSegment> = RouteOperationMethod<Entity, FullPath, ReturnType<Router[ 'navigateByUrl' ]>>;

type AutoNavigateObjectFor<
    Segment extends RoutePathSegment,
    FriendlyName extends string,
    Entity,
    Root extends string
> = {
        [k in AutoNavigateMethodName<RouteComposerName<FriendlyName, CombinedPath<Root, SegmentOf<Segment>>>>]:
            AutoNavigateMethod<Entity, RoutePathWithQuery<CombinedPath<Root, Segment>, QueryEntityOf<Segment>>>;
};

export type AutoNavigateRouteMethods<Route, Entity, Root extends string> =
    Route extends ReadonlyRoute<infer Segment, infer FriendlyName, infer Children> ?
    Children extends undefined
    ? AutoNavigateObjectFor<Segment, FriendlyName, Entity, Root>
    : Narrow<
        & AutoNavigateObjectFor<Segment, FriendlyName, Entity, Root>
        & AutoNavigateRouteArrayMethods<Children, Entity, RoutePathWithQuery<CombinedPath<Root, Segment>, QueryEntityOf<Segment>>>
    > : never;

export type AutoNavigateRouteArrayMethods<Routes, Entity, Root extends string> =
    Routes extends readonly [ infer Route ] ? AutoNavigateRouteMethods<Route, Entity, Root> :
    Routes extends readonly [ infer Route, ...infer Rest ] ?
    & AutoNavigateRouteMethods<Route, Entity, Root>
    & AutoNavigateRouteArrayMethods<Rest, Entity, Root>
    : never;

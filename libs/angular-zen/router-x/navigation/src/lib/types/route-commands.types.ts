import type { TrimPrefix } from '@bespunky/typescript-utils';
import type { ReadonlyRoute, WithRouteComposer } from './composable-routes.types';
import type { IsRouteArgument } from './route-paths.types';

type RouteSegmentType<
    Segment extends string,
    Entity
> =
    IsRouteArgument<Segment> extends true
    ? (Entity & Record<keyof any, unknown>)[TrimPrefix<Segment, ':'>]
    : Segment;

type OutletsCommand<AllowedCommands extends unknown[]> = {
    outlets: {
        [outletName: string]: AllowedCommands;
    };
};
    
type AllowedRouteCommands<
    Route extends ReadonlyRoute<string, string, any>,
    Entity,
    Commands extends unknown[] = []
> = Route extends ReadonlyRoute<infer Segment, string, infer Children>
    // The infer CommandsWithSegment in the next statement is simply used to create a reusable type value
    ? [...Commands, RouteSegmentType<Segment, Entity>] extends infer CommandsWithSegment extends unknown[]
    ?
        | Commands
        | CommandsWithSegment
        | AllowedChildrenRouteCommands<Children, Entity, CommandsWithSegment>
    : never
    : never;

type AllowedChildrenRouteCommands<
    Children extends readonly ReadonlyRoute<string, string, any>[] | undefined,
    Entity,
    Commands extends unknown[]
> =
    Children extends readonly [
        infer Child extends ReadonlyRoute<string, string, any>,
     ...infer OtherChildren extends readonly ReadonlyRoute<string, string, any>[]
    ]
    ?
        | AllowedRouteCommands<Child, Entity, Commands>
        | AllowedChildrenRouteCommands<OtherChildren, Entity, Commands>
    : never

export type RouteCommands<Route> =
    Route extends ReadonlyRoute<string, string, any> & WithRouteComposer<infer Entity, string, string>
    ? AllowedRouteCommands<Route, Entity> extends infer AllowedCommands extends unknown[]
    ?
        | AllowedCommands
        | [...AllowedCommands, OutletsCommand<AllowedCommands>]
    : never
    : never;

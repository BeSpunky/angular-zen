import type { TrimPrefix } from '@bespunky/typescript-utils';
import type { ReadonlyRoute, WithRouteComposer } from './composable-routes.types';
import type { IsRouteArgument } from './route-paths.types';

export type RouteCommands<
    Route
> = Route extends ReadonlyRoute<string, string, any> & WithRouteComposer<infer Entity, string, string>
    ? AllowedRouteCommands<[], Route, Entity> : never;

type AttachCommand<
    Commands extends unknown[],
    Segment extends string,
    Entity
> = IsRouteArgument<Segment> extends true
    ? [...Commands, (Entity & Record<keyof any, unknown>)[TrimPrefix<Segment, ':'>]]
    : [...Commands, Segment];

type AllowedRouteCommands<
    Commands extends unknown[],
    Route extends ReadonlyRoute<string, string, any>,
    Entity
> = Route extends ReadonlyRoute<infer Segment, string, infer Children>
    // The infer CommandsWithSegment in the next statement is simply used to create a reusable type value
    ? AttachCommand<Commands, Segment, Entity> extends infer CommandsWithSegment extends unknown[]
    ?
        | Commands
        | CommandsWithSegment
        | AllowedChildrenRouteCommands<CommandsWithSegment, Entity, Children>
    : never
    : never;

type AllowedChildrenRouteCommands<
    Commands extends unknown[],
    Entity,
    Children extends readonly ReadonlyRoute<string, string, any>[] | undefined
> = Children extends readonly [infer Child, ...infer Rest]
    ? Child extends ReadonlyRoute<string, string, any>
        ? Rest extends readonly ReadonlyRoute<string, string, any>[] | undefined
            ?
                | AllowedRouteCommands<Commands, Child, Entity>
                | AllowedChildrenRouteCommands<Commands, Entity, Rest>
            : never
        : never
    : never;
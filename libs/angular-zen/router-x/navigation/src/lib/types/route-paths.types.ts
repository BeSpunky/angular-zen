import type { Split, TrimPrefix, FirstChar, Join } from '@bespunky/typescript-utils';

export type RouteSegments<Path extends string> = Split<Path, '/'>;

export type RouteArgument<Path extends string> = Extract<RouteSegments<Path>[ number ], `:${ string }`>;

export type RouteArgumentName<Path extends string> = TrimPrefix<RouteArgument<Path>, ':'>;

export type CombinedPath<Root extends string, Segment extends string> = FirstChar<Root> extends string ? Join<[Root, Segment], '/'> : Segment;

export type IsRouteArgument<Path extends string> = Path extends `:${ string }` ? true : false;
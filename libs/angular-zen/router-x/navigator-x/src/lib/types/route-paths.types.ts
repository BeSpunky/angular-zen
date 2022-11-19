import type { FirstChar, Join, Split } from './_strings.types';

export type RouteSegments<Path extends string> = Split<Path, '/'>;

export type TrimPrefix<S extends string, Prefix extends string = ':'> = S extends `${ Prefix }${ infer Trimmed }` ? Trimmed : never;

export type RouteArgument<Path extends string> = Extract<RouteSegments<Path>[ number ], `:${ string }`>;

export type RouteArgumentName<Path extends string> = TrimPrefix<RouteArgument<Path>>;

export type CombinedPath<Root extends string, Segment extends string> = FirstChar<Root> extends string ? Join<[Root, Segment], '/'> : Segment;

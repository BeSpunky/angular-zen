import type { Split, TrimPrefix, FirstChar, Join } from '@bespunky/typescript-utils';

export declare const __QueryEntity__: unique symbol;

// The `path` property is used to extract the path string from the type when using `infer`.
// TypeScript cannot separate the string literal from the type, so I added a facilitating property to the branding object.
// Now `RoutePathWithQuery<infer P, any>` works and P is inferred as the path string.
export type RoutePath<Path extends string> = Path & { path: Path, withQuery<QueryEntity>(): RoutePathWithQuery<Path, QueryEntity> };
export type RoutePathWithQuery<Path extends string, QueryEntity> = Path & { path: Path, [__QueryEntity__]: Partial<QueryEntity> };

export type RoutePathSegment<Segment extends string = string, QueryEntity = unknown> = Segment | RoutePath<Segment> | RoutePathWithQuery<Segment, QueryEntity>;

export type QueryEntityOf<Path extends RoutePathSegment> =
    Path extends RoutePathWithQuery<string, infer QueryEntity> ? QueryEntity : never;

export type SegmentOf<Path extends RoutePathSegment> =
    Path extends RoutePathSegment<infer Segment, any> ? Segment : never;

export type RouteSegments<Path extends RoutePathSegment> = Split<SegmentOf<Path>, '/'>;

export type RouteArgument<Path extends RoutePathSegment> = Extract<RouteSegments<Path>[ number ], `:${ string }`>;

export type RouteArgumentName<Path extends RoutePathSegment> = TrimPrefix<RouteArgument<Path>, ':'>;

export type CombinedPath<Root extends RoutePathSegment, Segment extends RoutePathSegment> =
    SegmentOf<Root> extends infer Path1 extends string ?
    SegmentOf<Segment> extends infer Path2 extends string ?
    FirstChar<Path1> extends string ? Join<[Path1, Path2], '/'> : Path2 : never : never;

export type IsRouteArgument<Path extends RoutePathSegment> = SegmentOf<Path> extends `:${ string }` ? true : false;

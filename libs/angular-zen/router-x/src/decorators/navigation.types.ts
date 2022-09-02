import { Route, Router, Routes } from '@angular/router';

export type RouteSegments<Path extends string> =
    Path extends `` ? never :
    Path extends `/${ infer Rest }` ? RouteSegments<Rest> :
    Path extends `${ infer Segment }/${ infer Rest }` ? [Segment, ...RouteSegments<Rest>] :
    Path extends `${ infer Segment }` ? [Segment] : never;

export type RouteArgumentsOnly<Segments extends string[]> = 
    Segments extends [infer Segment, ...infer Rest] ?
        Segment extends `:${ infer ArgName }` ? [ArgName, ...RouteArgumentsOnly<string[] & Rest>] : RouteArgumentsOnly<string[] & Rest>
    : [];

export type RouteArguments<Path extends string> = RouteArgumentsOnly<RouteSegments<Path>>;

export type RouteArgumentsData<Path extends string> = {
    [key in RouteArguments<Path>[number]]: unknown
};

export type RouteInput<Path extends string, Descriptor extends RouteArgumentsData<Path>> = {
    [arg in RouteArguments<Path>[number]]: arg extends keyof Descriptor ? Descriptor[arg] : never;
};

export type RouteUrl = { path: string, descriptor: RouteArgumentsData<string> };

export type RouteUrls = { [key: string]: RouteUrl };

export type RoutePaths<Urls extends RouteUrls> = { [key in keyof Urls]: Urls[key]['path'] };

export type AutoNavigateMethodName<T extends string> = `to${ Capitalize<T> }`;

export type AutoNavigateMethod<Path extends string, Descriptor extends { [key: string]: any }> =
    RouteArguments<Path>['length'] extends 0
    ? () => ReturnType<Router['navigateByUrl']>
    : (input: RouteInput<Path, Descriptor>) => ReturnType<Router['navigateByUrl']>;

export type AutoNavigateMethods<Urls extends RouteUrls> = {
    [key in keyof Urls as AutoNavigateMethodName<string & key>]: AutoNavigateMethod<Urls[key]['path'], Urls[key]['descriptor']>
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type RouteDescriptor<Path extends string, Descriptor extends Record<string, any> = never> = {
    path: Path,
    descriptor: Descriptor
}

export type ComposedPath<Paths extends string[]> = Paths extends & [infer First, ...infer Rest] ? `${string & First}${ComposedPath<string[] & Rest>}` : '';

export function routePath<Paths extends string[]>(...paths: Paths): ComposedPath<Paths> {
    return paths.join('') as ComposedPath<Paths>;
}

type routes = [
    {
        path: 'base',
        children: [
            {
                path: 'child1',
                children: [
                    {
                        path: 'grandchild1',
                        children: [
                            {
                                path: 'grandgrandchild1'
                            },
                            {
                                path: 'grandgrandchild2'
                            },
                        ]
                    },
                    {
                        path: 'grandchild2'
                    }
                ]
            },
            {
                path: 'child2',
            }
        ]
    },
    {
        path: 'root',
        children: [
            {
                path: 'child1',
                children: [
                    {
                        path: 'grandchild1'
                    },
                    {
                        path: 'grandchild2'
                    }
                ]
            },
            {
                path: 'child2',
            }
        ]
    }
];

type RoutePath<R extends Route> = R['path'] extends string ? R['path'] : '';
type RouteChildren<R extends Route> = R['children'] extends Routes ? R['children'] : never;
type LengthOf<A extends Array<unknown>> = A extends Array<unknown> ? A['length'] : never;

type ExtractRoutePathFromAll<Routes extends Route[], Root extends string = ''> =
    LengthOf<Routes> extends 0
    ? [Root]
    : Routes extends [infer FirstRoute, ...infer OtherRoutes]
        ? [
            ...ExtractRoutePathFromAll<OtherRoutes, Root>,
            ...ExtractRoutePaths<FirstRoute, Root>
        ]
        : []
;

type ExtractRoutePaths<R extends Route, Root extends string = ''> =
    LengthOf<RouteChildren<R>> extends 0
    ? [`${ Root }/${ RoutePath<R> }`]
    : ExtractRoutePathFromAll<RouteChildren<R>, `${ Root }/${ RoutePath<R> }`>
    ;

const something: ExtractRoutePathFromAll<routes>;

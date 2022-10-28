/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { Route, Router } from '@angular/router';

export type Head<T> = T extends [infer First, ...infer _] ? First : unknown;
export type Tail<T> = T extends [...infer _, infer Last] ? Last : unknown;
export type NoHead<T> = T extends [infer _, ...infer Rest] ? Rest : unknown;
export type NoTail<T> = T extends [...infer Rest, infer _] ? Rest : unknown;

export type FirstChar<T> = T extends `${infer First }${ string }` ? First : unknown;
export type LastChar<T> = T extends `${ string }${ infer Last }` ? Last : unknown;

export type Split<S extends string, Separator extends string> =
    S extends `` ? [] :
    S extends `${ Separator }${ infer Rest }` ? Split<Rest, Separator> :
    S extends `${ infer Part }${Separator}${ infer Rest }` ? [Part, ...Split<Rest, Separator>] :
    S extends `${ infer Part }` ? [Part] : string[];

export type Join<Strings extends string[], Separator extends string> =
    Strings extends [infer S, ...infer Rest]
    ? S extends string
    ? Rest extends string[]
    ? Rest['length'] extends 0 ? S : `${S}${Separator}${Join<Rest, Separator>}`
    : S
    : never
    : '';

type PFOA = Split<'j//theaters/:theaterId/', '/'>
type AJ = Join<PFOA, '.'>
// =================================================================================

type Primitive = undefined | null | number | bigint | boolean | string;

export type Narrow<T> =
    | T extends Function | Primitive | [] ? T : never
    | { [K in keyof T]: Narrow<T[K]> };

type CharArray<S extends string> = {
    0: [''],
    1: [S],
    more: S extends `${infer First}${infer Rest}` ? [First, ...CharArray<Rest>] : never
}[S['length'] extends 0 | 1 ? S['length'] : 'more']

type DigitChar  = '0'|'1'|'2'|'3'|'4'|'5'|'6'|'7'|'8'|'9';
type LetterChar = 'a'|'b'|'c'|'d'|'e'|'f'|'g'|'h'|'i'|'j'|'k'|'l'|'m'|'n'|'o'|'p'|'q'|'r'|'s'|'t'|'u'|'v'|'w'|'x'|'y'|'z';

type ValidRouteNameChar =
    | DigitChar
    | LetterChar
    | Capitalize<LetterChar>
    | '-' | '_'
    | '';


// type ValidRouteName<Name extends string> =
//     Name extends `${ infer Char }${ infer Rest }` ?
//     Char extends ValidRouteNameChar ? JoinStrings<Char, ValidRouteName<Rest>> : `{${ Char }}${Rest} - The char wrapped in brackets is invalid for route names.` : '';
export const _RouteComposer_ = Symbol('RouteComposer');

export interface ReadonlyRoute<PathSegment extends string, FriendlyName extends string> extends Readonly<Omit<Route, 'path' | 'children'>>
{
    readonly friendlyName?: FriendlyName;
    readonly path?: PathSegment;
}

export interface ReadonlyRouteChildren<Children extends readonly ReadonlyRoute<string, string>[] | undefined>
{
    readonly children?: Children;
}

export interface ReadonlyRouteComposer<Entity, FullPath extends string, Name extends string>
{
    readonly [_RouteComposer_]: RouteComposer<Entity, FullPath, Name>
}

type Writable<T> = {
    -readonly [key in keyof T]: T[key] extends Primitive ? T[key] : Writable<T[key]>
};

// ====================================================================================

export type RouteSegments<Path extends string> = Split<Path, '/'>;

export type TrimPrefix<S extends string, Prefix extends string = ':'> = S extends `${ Prefix }${ infer Trimmed }` ? Trimmed : never

export type RouteArgument<Path extends string> = Extract<RouteSegments<Path>[number], `:${ string }`>;

export type RouteArgumentName<Path extends string> = TrimPrefix<RouteArgument<Path>>;

export type EntityRouteArgs<T, Path extends string> =
    RouteArgumentName<Path> extends keyof T
    ? Pick<T, RouteArgumentName<Path>>
    : `Route argument '${ Exclude<RouteArgumentName<Path>, keyof T> }' doesn't match any property on the route's corresponding entity.`;

// =======================================================================================

export type CombinedPath<Root extends string, Segment extends string> = Root extends '' ? Segment : Join<[Root, Segment], '/'>;

export type ttt = CombinedPath<'ha/asd','va/asd'>

type ComposableRoutesArray<Children, Entity, FullPath extends string> =
    Children extends readonly [infer First, ...infer Rest] ?
    First extends ReadonlyRoute<infer Segment, string> ?
    readonly [
        ComposableRoute<First, Entity, CombinedPath<FullPath, Segment>>,
        ...ComposableRoutesArray<Rest, Entity, FullPath>
    ]
    : []
    : [];

export type ComposableRoute<Route, Entity, FullPath extends string> =
    Route extends ReadonlyRoute<infer Segment, infer FriendlyName> & ReadonlyRouteChildren<infer Children> ?
    & ReadonlyRouteComposer<Entity, FullPath, RouteComposerName<FriendlyName, FullPath>>    
    & ReadonlyRoute<Segment, FriendlyName>
    & { readonly children?: ComposableRoutesArray<Children, Entity, FullPath> }
    : never;

type hf = RouteSegments<TESTROUTE>
type RA = RouteArgument<TESTROUTE>;

export type RouteOperationMethod<Entity, Path extends string, ReturnType> =
    RouteArgument<Path> extends never
    ? () => ReturnType
    : (entity: EntityRouteArgs<Entity, Path>) => ReturnType;

type RouteComposerComposeMethod<Entity, Path extends string> = RouteOperationMethod<Entity, Path, string>;

function extractArgsFromPath<Path extends string>(path: Path): RouteArgument<Path>[]
{
    return path
        .split('/')
        .filter(segment => segment.startsWith(':')) as RouteArgument<Path>[];
}

function touchFirstLetter([firstLetter, ...rest]: string, touch: (first: string) => string): string 
{
    return firstLetter ? touch(firstLetter) + rest.join('') : '';
}

function firstUpper(value: string): string
{
    return touchFirstLetter(value, first => first.toUpperCase());
}

function firstLower(value: string): string
{
    return touchFirstLetter(value, first => first.toLowerCase());
}

const autoNavigatorNameSeparator = '';

function generateRouteComposerName<Path extends string>(path: Path): GeneratedRouteComposerName<Path>
{
    return path
        .replace(/\/:/g, '/')
        .split('/')
        .map(firstUpper)
        .join(autoNavigatorNameSeparator) as GeneratedRouteComposerName<Path>;
}

type CapitalizeRouteSegment<Segment extends string> =
    Segment['length'] extends 0 | 1 ? never :
    Segment extends `:${ infer ArgName }` ? Capitalize<ArgName> : Capitalize<Segment>;

type JoinStrings<S1 extends string, S2 extends string> = `${ S1 }${ S2 }`;

type SegmentedRouteComposerName<Segments extends string[], Separator extends ValidRouteNameChar = ''> = {
    0: '',
    1: CapitalizeRouteSegment<Segments[0]>,
    multi: Segments extends [infer First, ...infer Rest] ?
             First extends string ?
               Rest extends string[]
               ? JoinStrings<CapitalizeRouteSegment<First>, JoinStrings<Separator, SegmentedRouteComposerName<Rest, ''>>>
               : never
             : never
           : never
}[Segments['length'] extends 0 | 1 ? Segments['length'] : 'multi']

export type GeneratedRouteComposerName<Path extends string> = SegmentedRouteComposerName<RouteSegments<Path>>;

type TESTROUTE = '/theaters/:theaterId/shows/:showName';

type pal = GeneratedRouteComposerName<TESTROUTE>;

export class RouteComposer<Entity, FullPath extends string, Name extends string>
{
    public readonly args: RouteArgument<FullPath>[];
    public readonly compose: RouteComposerComposeMethod<Entity, FullPath>;

    constructor(public readonly path: FullPath, public readonly name: Name)
    {
        this.args = extractArgsFromPath(path);
        this.compose = (this.args.length ? this.routePathWithArgs.bind(this) : this.routePath.bind(this)) as RouteComposerComposeMethod<Entity, FullPath>;
    }

    private routePathWithArgs(entity: EntityRouteArgs<Entity, FullPath>)
    {
        return this.args.reduce(
            (route: string, arg: string) =>
            {
                const argName = arg.substring(1) as keyof EntityRouteArgs<Entity, FullPath>;

                return route.replace(arg, String(entity[argName]));
            },
            this.path
        );
    }

    private routePath() { return this.path; }
}

export function routeConfigFor<Entity>()
{
    function combinePath<Root extends string, Segment extends string>(root: Root, segment?: Segment)
    {
        return (segment ? `${ root }/${ segment }` : root) as CombinedPath<Root, Segment>;
    }

    function createFullRoutePath<
        Route    extends ReadonlyRoute<Segment, string>,
        Segment  extends string,
        Root     extends string,
        FullPath extends CombinedPath<Root, Segment>
    >(tree: Route, root: Root): FullPath
    {
        return combinePath(root, tree.path) as FullPath;
    }

    function createComposableChildrenRecursively<
        Route    extends ReadonlyRoute<Segment, string> & ReadonlyRouteChildren<Children>,
        Segment  extends string,
        Children extends readonly ReadonlyRoute<string, string>[],
        Root     extends string,
        FullPath extends CombinedPath<Root, Segment>
    >(tree: Route, path: FullPath)
    {
        return tree.children?.map(child => prefixedRoute(child, path)) as
            ComposableRoutesArray<Children, Entity, FullPath> | undefined;
    }

    function createRouteComposer<
        Route        extends ReadonlyRoute<string, FriendlyName>,
        FriendlyName extends string,
        FullPath     extends string,
        ComposerName extends RouteComposerName<FriendlyName, FullPath>
    >(tree: Route, path: FullPath): RouteComposer<Entity, FullPath, ComposerName>
    {
        const composerName = (tree.friendlyName ?? generateRouteComposerName(path)) as ComposerName;

        return new RouteComposer<Entity, FullPath, ComposerName>(path, composerName);
    }

    function prefixedRoute<
        Segment      extends string,
        FriendlyName extends string,
        Children     extends readonly ReadonlyRoute<string, string>[],
        Root         extends string
    >(route: ReadonlyRoute<Segment, FriendlyName> & ReadonlyRouteChildren<Children>, root: Root): ComposableRoute<typeof route, Entity, CombinedPath<Root, Segment>>
    {
        const path         = combinePath(root, route.path) as CombinedPath<Root, Segment>;
        const composerName = (route.friendlyName ?? generateRouteComposerName(path)) as RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>;

        const composer = new  RouteComposer<Entity, CombinedPath<Root, Segment>, RouteComposerName<FriendlyName, CombinedPath<Root, Segment>>>(path, composerName);
        const children = route.children?.map(child => prefixedRoute(child, path)) as
                            ComposableRoutesArray<Children, Entity, CombinedPath<Root, Segment>> | undefined;

        return {
            ...route,
            children,
            [_RouteComposer_]: composer
        } as const as ComposableRoute<typeof route, Entity, CombinedPath<Root, Segment>>;
    }


    function route<
        Segment      extends string,
        FriendlyName extends string,
        Children     extends readonly ReadonlyRoute<string, string>[]
    >(route: ReadonlyRoute<Segment, FriendlyName> & ReadonlyRouteChildren<Children>): ComposableRoute<typeof route, Entity, CombinedPath<'', Segment>>
    {
        // When the `root` arg was optional with a default value of `''`, TS appended `${string}` (e.g. `${string}/theaters/:theaterId`)
        // to the route template for some reason, which breaks the arg extraction later on.
        // Passing `''` manually however, leaves the template as is should be (e.g. `/theaters/:theaterId`) and allows the string template to be interpreted well.
        // `route()` and `prefixedRoute()` were seperated to allow the developer to call `route()` without providing `''`.
        // The `prefixedRoute()` is exposed to the world as it might be usefull in the future (e.g. lazy loaded routes? maybe...?)
        return prefixedRoute(route, '');
    }

    return {
        route,
        prefixedRoute
    };
}

export type RouteComposerName<FriendlyName extends string | undefined, FullPath extends string> =
    FirstChar<FriendlyName> extends string ? FriendlyName : GeneratedRouteComposerName<FullPath>;

export type AutoNavigateMethodName<T extends string> = `to${ Capitalize<T> }`;

export type AutoNavigateMethod<Entity, FullPath extends string> = RouteOperationMethod<Entity, FullPath, ReturnType<Router['navigateByUrl']>>;

export type AutoNavigateRouteMethods<Route, Entity, FullPath extends string> =
    Route extends ReadonlyRoute<infer Segment, infer FriendlyName> & ReadonlyRouteChildren<infer Children> ?
    & { [k in AutoNavigateMethodName<RouteComposerName<FriendlyName, CombinedPath<FullPath, Segment>>>]: AutoNavigateMethod<Entity, CombinedPath<FullPath, Segment>> }
    & AutoNavigateRouteArrayMethods<Children, Entity, CombinedPath<FullPath, Segment>>
    : {};

export type AutoNavigateRouteArrayMethods<Routes, Entity, FullPath extends string> =
    Routes extends readonly [infer Route, ...infer Rest] ?
    & AutoNavigateRouteMethods<Route, Entity, FullPath>
    & AutoNavigateRouteArrayMethods<Rest, Entity, FullPath>
    : {};

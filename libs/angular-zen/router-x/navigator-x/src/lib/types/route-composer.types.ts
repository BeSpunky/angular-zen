import { RouteOperationMethod } from './auto-navigator-methods.types';
import { RouteArgumentName, RouteSegments } from './route-paths.types';
import { FirstChar } from './_strings.types';
import { ValidRouteNameChar } from './___composer-name-validation.types';

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

export type RouteComposerName<FriendlyName extends string | undefined, FullPath extends string> =
    FirstChar<FriendlyName> extends string ? FriendlyName : GeneratedRouteComposerName<FullPath>;

export type RouteComposerComposeMethod<Entity, Path extends string> = RouteOperationMethod<Entity, Path, string>;

export type EntityRouteArgs<T, Path extends string> =
    RouteArgumentName<Path> extends keyof T
    ? Pick<T, RouteArgumentName<Path>>
    : `Route argument '${ Exclude<RouteArgumentName<Path>, keyof T> }' doesn't match any property on the route's corresponding entity.`;



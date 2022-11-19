import type { RouteOperationMethod } from './auto-navigator-methods.types';
import type { RouteArgumentName, RouteSegments } from './route-paths.types';
import type { FirstChar } from './_strings.types';
import type { Narrow } from './_utils.types';
import type { ValidRouteNameChar } from './___composer-name-validation.types';

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

export type EntityRouteArgs<Entity, Path extends string> =
    RouteArgumentName<Path> extends keyof Entity
    ? Narrow<Pick<Entity, RouteArgumentName<Path>>>
    : `Route argument '${ Exclude<RouteArgumentName<Path>, keyof Entity> }' doesn't match any property on the route's corresponding entity.`;



import { RouteComposer } from './router-composer';
import { firstUpper } from '../_utils/_string-utils';
import { ReadonlyRouteChildren, ReadonlyRouteComposer, _RouteComposer_ } from '../types/composable-routes.types';
import { RouteArgument } from '../types/route-paths.types';

// TODO: Warn if multiple composers with the same name were found
export function collectRouteComposersByAutoNavigatorName(route: ReadonlyRouteComposer<unknown, string, string> & ReadonlyRouteChildren<any>): Map<string, RouteComposer<unknown, string, string>>
{
    const composer = route[ _RouteComposer_ ];
    const autoNavigatorName = `to${ firstUpper(composer.name) }`;

    const childComposers = collectArrayRouteComposersByAutoNavigatioName(route.children);

    return new Map([
        [ autoNavigatorName, composer ],
        ...(childComposers ?? [])
    ]);
}

function collectArrayRouteComposersByAutoNavigatioName(routes: (ReadonlyRouteComposer<unknown, string, string> & ReadonlyRouteChildren<any>)[]): Map<string, RouteComposer<unknown, string, string>>
{
    return routes?.map(collectRouteComposersByAutoNavigatorName)
        .reduce((allNestedComposers, childComposers) => new Map([ ...allNestedComposers, ...childComposers ]), new Map());
}

export function extractArgsFromPath<Path extends string>(path: Path): RouteArgument<Path>[]
{
    return path
        .split('/')
        .filter(segment => segment.startsWith(':')) as RouteArgument<Path>[];
}
import { RouteComposer } from './router-composer';
import { firstUpper } from '../_utils/_string-utils';
import { _RouteComposer_ } from '../_navigation-x.symbols';

import type { ReadonlyRoute, WithRouteComposer } from '../types/composable-routes.types';
import type { RouteArgument } from '../types/route-paths.types';

// TODO: Warn if multiple composers with the same name were found
export function collectRouteComposersByAutoNavigatorName(route: WithRouteComposer<unknown, string, string> & ReadonlyRoute<string, string, any>): Map<string, RouteComposer<unknown, string, string>>
{
    const composer = route[ _RouteComposer_ ];
    const autoNavigatorName = `to${ firstUpper(composer.name) }`;

    const childComposers = collectArrayRouteComposersByAutoNavigatioName(route.children);

    return new Map([
        [ autoNavigatorName, composer ],
        ...(childComposers ?? [])
    ]);
}

function collectArrayRouteComposersByAutoNavigatioName(routes: (WithRouteComposer<unknown, string, string> & ReadonlyRoute<string, string, any>)[]): Map<string, RouteComposer<unknown, string, string>>
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
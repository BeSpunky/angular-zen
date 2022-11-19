import { FactoryProvider, Provider } from '@angular/core';
import { provideRouter, provideRoutes, Router } from '@angular/router';
import { collectRouteComposersByAutoNavigatorName } from './route-composer/_utils';
import { _NavigatorXToken_ } from './_navigator-x.symbols';

import type { RouteComposer } from './route-composer/router-composer';
import type { ComposableRootRoute, WithNavigationX, ReadonlyRoute, WithRouteComposer } from './types/composable-routes.types';
import type { NoHead } from './types/_arrays.types';

function attemptToProduceAutoNavigateFunctionFor(router: Router, composer?: RouteComposer<unknown, string, string>)
{
    if (!composer) return undefined;

    if (composer.hasArgs)
    {
        const compose = composer.compose.bind(composer) as (entity: unknown) => string;
        
        return (entity: unknown) => router.navigateByUrl(compose(entity));
    }

    return () => router.navigateByUrl(composer.compose());
}

function createNavigatorXFrom(route: ReadonlyRoute<string, string, any> & WithRouteComposer<any, string, string> & WithNavigationX<any, any, string>): FactoryProvider
{
    return {
        provide: route[ _NavigatorXToken_ ],
        deps: [Router],
        useFactory: (router: Router) => 
        {    
            const composers = collectRouteComposersByAutoNavigatorName(route);
    
            return new Proxy({}, {
                get: (_, propertyName: string) =>
                    attemptToProduceAutoNavigateFunctionFor(router, composers.get(propertyName)),
                
                has: (_, propertyName: string) => composers.has(propertyName)
            });
        }
    };
}

export function provideRouterX(routes: ComposableRootRoute<any>[], ...features: NoHead<Parameters<typeof provideRouter>>): Provider[]
{
    return [
        ...provideRouter(routes, ...features),
        ...provideRoutesX(...routes)
    ];
}

export function provideRoutesX(...routes: ComposableRootRoute<any>[])
{
    if (!routes?.length) throw `No routes were provided.`;

    const navigators = routes.map(createNavigatorXFrom);

    return [
        ...navigators,
        ...provideRoutes(routes)
    ];
}



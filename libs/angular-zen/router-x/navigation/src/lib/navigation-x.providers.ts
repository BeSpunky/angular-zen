import { FactoryProvider, Provider } from '@angular/core';
import { provideRouter, provideRoutes, Router } from '@angular/router';
import { collectRouteComposersByAutoNavigatorName } from './route-composer/_utils';
import { _NavigatorXToken_ } from './_navigation-x.symbols';

import type { RouteComposer } from './route-composer/router-composer';
import type { NavigationXRoute, WithNavigationX, ReadonlyRoute, WithRouteComposer } from './types/composable-routes.types';
import type { NoHead } from './types/_arrays.types';

function attemptToProduceAutoNavigationFunctionFor(router: Router, composer?: RouteComposer<unknown, string, string>): ((entity: unknown) => Promise<boolean>) | undefined
{
    if (!composer) return undefined;

    if (composer.hasArgs)
    {
        const compose = composer.compose.bind(composer) as (entity: unknown) => string;
        
        return (entity: unknown) => router.navigateByUrl(compose(entity));
    }

    return () => router.navigateByUrl(composer.compose());
}

function createNavigationXFactoryProvider(route: ReadonlyRoute<string, string, any> & WithRouteComposer<any, string, string> & WithNavigationX<any, any, string>): FactoryProvider
{
    return {
        provide: route[ _NavigatorXToken_ ],
        deps: [Router],
        useFactory: (router: Router) => 
        {    
            const composers = collectRouteComposersByAutoNavigatorName(route);
    
            return new Proxy({}, {
                get: (_, propertyName: string) =>
                    attemptToProduceAutoNavigationFunctionFor(router, composers.get(propertyName)),
                
                has: (_, propertyName: string) => composers.has(propertyName)
            });
        }
    };
}

function provideNavigatorsFor(...routes: NavigationXRoute<any>[]): FactoryProvider[]
{
    if (!routes?.length) throw `No routes were provided.`;

    return routes.map(createNavigationXFactoryProvider);
}


export function provideRouterX(routes: NavigationXRoute<any>[], ...features: NoHead<Parameters<typeof provideRouter>>): Provider[]
{
    return [
        ...provideRouter(routes, ...features),
        ...provideNavigatorsFor(...routes)
    ];
}

export function provideRoutesX(...routes: NavigationXRoute<any>[]): Provider[]
{
    return [
        ...provideRoutes(routes),
        ...provideNavigatorsFor(routes)
    ];
}



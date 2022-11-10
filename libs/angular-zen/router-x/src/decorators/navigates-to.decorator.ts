import { FactoryProvider, inject, Provider } from '@angular/core';
import { provideRouter, provideRoutes, Router } from '@angular/router';

import { RouteComposer, _RouteComposer_, ReadonlyRouteChildren, ReadonlyRouteComposer, NoHead, _NavigatorToken_, ComposableRootRoute, ReadonlyRoute, NavigationXRoute, AutoNavigateRouteMethods} from './route-composition';

function touchFirstLetter([firstLetter, ...rest]: string, touch: (first: string) => string): string 
{
    return firstLetter ? touch(firstLetter) + rest.join('') : '';
}

function firstUpper(value: string): string
{
    return touchFirstLetter(value, first => first.toUpperCase());
}

// TODO: Warn if multiple composers with the same name were found
function collectRouteComposersByAutoNavigatorName(route: ReadonlyRouteComposer<unknown, string, string> & ReadonlyRouteChildren<any>): Map<string, RouteComposer<unknown, string, string>>
{
    const composer = route[_RouteComposer_];
    const autoNavigatorName = `to${ firstUpper(composer.name) }`;

    const childComposers = collectArrayRouteComposersByAutoNavigatioName(route.children);

    return new Map([
        [autoNavigatorName, composer],
        ...(childComposers ?? [])
    ]);
}

function collectArrayRouteComposersByAutoNavigatioName(routes: (ReadonlyRouteComposer<unknown, string, string> & ReadonlyRouteChildren<any>)[]): Map<string, RouteComposer<unknown, string, string>>
{
    return routes?.map(collectRouteComposersByAutoNavigatorName)
                  .reduce((allNestedComposers, childComposers) => new Map([...allNestedComposers, ...childComposers]), new Map());
}

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

export function withNavigationXToken(route: ReadonlyRoute<string, string> & ReadonlyRouteChildren<any> & ReadonlyRouteComposer<any, string, string> & NavigationXRoute<any, any, string>): FactoryProvider
{
    return {
        provide: route[ _NavigatorToken_ ],
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
    if (!routes?.length) throw `No composable routes were provided to the @NavigatesTo() decorator.`;

    const navigators = routes.map(withNavigationXToken);

    return [
        ...navigators,
        ...provideRoutes(routes)
    ];
}

export function useNavigationX<
    Route extends ReadonlyRoute<string, string> & ReadonlyRouteChildren<any>,
    Entity,
    Root extends string,
    FullPath extends string,
    ComposerName extends string
>(route: Route & ReadonlyRouteComposer<Entity, FullPath, ComposerName> & NavigationXRoute<Route, Entity, Root>)//: AutoNavigateRouteMethods<Route, Entity, Root>
{
    const newLocal = route[ _NavigatorToken_ ];
    return inject(newLocal);
}

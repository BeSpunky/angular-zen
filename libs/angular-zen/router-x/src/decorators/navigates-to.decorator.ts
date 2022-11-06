import { FactoryProvider, inject, Injectable, Provider } from '@angular/core';
import { provideRouter, provideRoutes, Router } from '@angular/router';

import { RouteComposer, _RouteComposer_, ReadonlyRouteChildren, ReadonlyRouteComposer, ReadonlyRoute, AutoNavigateRouteMethods, NoHead, NavigationXRoute, _NavigatorToken_, ComposableRootRoute} from './route-composition';

function touchFirstLetter([firstLetter, ...rest]: string, touch: (first: string) => string): string 
{
    return firstLetter ? touch(firstLetter) + rest.join('') : '';
}

function firstUpper(value: string): string
{
    return touchFirstLetter(value, first => first.toUpperCase());
}

// TODO: Warn if multiple composers with the same name were found
function collectRouteComposersByAutoNavigatorName(route: ReadonlyRouteComposer<any, string, string> & ReadonlyRouteChildren<any>): Map<string, RouteComposer<any, string, string>>
{
    const composer = route[_RouteComposer_];
    const autoNavigatorName = `to${ firstUpper(composer.name) }`;

    const childComposers = collectArrayRouteComposersByAutoNavigatioName(route.children);

    return new Map([
        [autoNavigatorName, composer],
        ...(childComposers ?? [])
    ]);
}

function collectArrayRouteComposersByAutoNavigatioName(routes: (ReadonlyRouteComposer<any, string, string> & ReadonlyRouteChildren<any>)[]): Map<string, RouteComposer<any, string, string>>
{
    return routes?.map(collectRouteComposersByAutoNavigatorName)
                  .reduce((allNestedComposers, childComposers) => new Map([...allNestedComposers, ...childComposers]), new Map());
}

function attemptToProduceAutoNavigateFunctionFor(router: Router, composer?: RouteComposer<any, string, string>)
{
    if (!composer) return undefined;

    if (composer.hasArgs)
    {
        const compose = composer.compose.bind(composer) as (entity: unknown) => string;
        
        return (entity: unknown) => router.navigateByUrl(compose(entity));
    }

    return () => router.navigateByUrl(composer.compose());
}

export function withNavigationXToken<
    Route extends ReadonlyRoute<Segment, FriendlyName> & ReadonlyRouteComposer<Entity, FullPath, ComposerName> & ReadonlyRouteChildren<Children> & NavigationXRoute<Route, Entity, FullPath>,
    Entity,
    Segment extends string,
    FriendlyName extends string,
    FullPath extends string,
    ComposerName extends string,
    Children extends ReadonlyRoute<string, string>[]
>(route: Route): FactoryProvider
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

export function provideRouterX(routes: (ReadonlyRoute<string, string> & ReadonlyRouteComposer<any, string, string> & ReadonlyRouteChildren<any> & NavigationXRoute<any, any, string>)[], ...features: NoHead<Parameters<typeof provideRouter>>): Provider[]
{
    return [
        ...provideRouter(routes, ...features),
        ...provideRoutesX(...routes)
    ];
}

export function provideRoutesX(...routes: (ReadonlyRouteComposer<any, string, string> & ReadonlyRouteChildren<any> & NavigationXRoute<any, any, string>)[])
{
    if (!routes?.length) throw `No composable routes were provided to the @NavigatesTo() decorator.`;

    const navigators = routes.map(withNavigationXToken);

    return [
        ...navigators,
        ...provideRoutes(routes)
    ];
}

export function useNavigationX<Route, Entity, FullPath extends string>(route: ComposableRootRoute<Route, Entity, FullPath>): AutoNavigateRouteMethods<Route, Entity, FullPath>
{
    return inject(route[ _NavigatorToken_ ]);
}

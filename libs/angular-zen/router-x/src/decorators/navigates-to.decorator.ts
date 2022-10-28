import { Inject, Injectable, Optional, Type } from '@angular/core';
import { NavigateService } from '../services/navigate.service';

import { RouteComposer, _RouteComposer_, ReadonlyRouteChildren, ReadonlyRouteComposer} from './route-composition';

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

export function NavigatesTo(...routes: (ReadonlyRouteComposer<any, string, string> & ReadonlyRouteChildren<any>)[])
{
    if (!routes?.length) throw `No composable routes were provided to the @NavigatesTo() decorator.`;

    const composers = collectArrayRouteComposersByAutoNavigatioName(routes);

    return function <TConstructor extends Type<any>>(constructor: TConstructor): TConstructor
    {
        @Injectable()
        class NavigateXCoreService extends NavigateService { }
        
        class NavigateXService extends NavigateXCoreService
        {
            constructor(...args: any[])
            {
                super(...args);

                return new Proxy(this, {
                    get: (target, propertyName: string) =>
                        this.attemptToProduceAutoNavigateFunctionFor(propertyName) ?? target[propertyName as keyof this],
                    
                    has: (target, propertyName: string) => propertyName in target || composers.has(propertyName)
                });
            }

            private attemptToProduceAutoNavigateFunctionFor(propertyName: string)
            {
                const composer = composers.get(propertyName);
                
                if (!composer) return undefined;

                return (entity: any): ReturnType<NavigateService['navigateTo']> =>
                {
                    const composeRoute = composer.compose.bind(composer) as (entity: any) => string;

                    return this.navigateTo(composeRoute(entity));
                };
            }
        };

        return NavigateXService;
    };
}

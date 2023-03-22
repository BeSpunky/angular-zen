import { TestBed             } from '@angular/core/testing';
import { Route, Router       } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { forceRoutingInsideAngularZone                                                                                   } from '@bespunky/angular-zen/core/testing';
import { createDeeplyNestedRoutes, DeepRouteSegments, NoopModule, NoopComponent                                          } from '@bespunky/angular-zen/router-x/testing';
import { UrlLocalizationStrategy, LanguageIntegrationModule, UrlLocalizer, UrlLocalizationService, UrlLocalizationConfig } from '@bespunky/angular-zen/language';
import { UrlReflectionService                                                                                            } from '@bespunky/angular-zen/router-x';
import { LanguageConfig                                                                                                  } from './language-integration-config';

/**
 * Configures the testing module with localized routes for testing and language integration services.
 * Routes are created by running `createDeeplyNestedRoutes(DeepRouteSegments)`.
 * Language integration tools are read from `LanguageConfig`.
 * 
 * The function extracts services from the testbed and returns them in the returned object for quick deconstruction.
 * 
 * @export
 * @param {(UrlLocalizationStrategy | UrlLocalizationConfig)} strategyOrConfig The url localization strategy or full config.
 * @returns A deconstructable object with ready to use language tools. See intellisense.
 */
export function setupUrlLocalizerTest(strategyOrConfig?: UrlLocalizationStrategy | UrlLocalizationConfig)
{
    const nestedRoutes = createLocalizedDeeplyNestedRoutes(DeepRouteSegments);
    const config       = isUrlLocalizationConfig(strategyOrConfig) ? strategyOrConfig : { strategy: strategyOrConfig } as UrlLocalizationConfig;

    TestBed.configureTestingModule({
        imports: [
            NoopModule,
            RouterTestingModule.withRoutes([nestedRoutes]),
            LanguageIntegrationModule.forRoot({
                useFactory     : () => LanguageConfig,
                urlLocalization: config
            })
        ]
    });

    const localizer       = TestBed.inject(UrlLocalizer);
    const urlLocalization = TestBed.inject(UrlLocalizationService);
    const urlReflection   = TestBed.inject(UrlReflectionService);
    const router          = TestBed.inject(Router);
    
    forceRoutingInsideAngularZone(router);

    router.initialNavigation();

    return { localizer, urlLocalization, urlReflection, router };
}

/**
 * Recoursively creates nested routes for the specified segments.
 * Each specified segment will be a child route of its previous segment.
 * Each created route will support 2 paths:
 * 1. The segment name.
 * 2. An 'en' path.
 * 
 * #### Example
 * Running the function on `['some', 'route']` will result in the following supported routes:  
 * /  
 * 
 * /some  
 * /some/route  
 *   
 * /en/  
 * /en/some  
 * /en/some/route  
 *   
 * /some/en  
 * /some/en/route  
 *   
 * /some/route/en  
 * 
 * @export
 * @param {string[]} segments
 * @returns {Route}
 */
export function createLocalizedDeeplyNestedRoutes(segments: string[]): Route
{
    const nestedRoutes = createDeeplyNestedRoutes(segments);
    
    localizeRoute(nestedRoutes);

    return nestedRoutes;
}

/**
 * Recoursively adds an 'en' segment to all routes in the tree.
 *
 * @param {Route} route The top most route to localize.
 */
function localizeRoute(route: Route): void
{
    route.children ||= [];
    route.children.forEach(child => localizeRoute(child));

    const localizedRoute: Route = { path: 'en', component: NoopComponent };

    // Copy the children of the current route to the localized route as well to ensure a route can be
    // accessed with or without localization (i.e. the /en) prefix.
    localizedRoute.children = [...route.children];
    // Add the english segment as the first child of the route
    route.children.unshift(localizedRoute);
}

/**
 * Checks whether the given value is a url localization config object.
 *
 * @param {*} value The value to test.
 * @returns {value is UrlLocalizationConfig} `true` if the value is a `UrlLocalizationConfig` object; otherwise `false`.
 */
function isUrlLocalizationConfig(value: any): value is UrlLocalizationConfig
{
    const strategy = value?.strategy;

    return strategy && (typeof strategy === 'number' || typeof strategy === 'string' || strategy.useClass || strategy.useFactory);
}
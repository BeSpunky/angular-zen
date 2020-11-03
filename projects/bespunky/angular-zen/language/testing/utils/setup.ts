import { Component           } from '@angular/core';
import { TestBed             } from '@angular/core/testing';
import { Route, Router       } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { forceRoutingInsideAngularZone                                                                                   } from '@bespunky/angular-zen/core/testing';
import { UrlLocalizationStrategy, LanguageIntegrationModule, UrlLocalizer, UrlLocalizationService, UrlLocalizationConfig } from '@bespunky/angular-zen/language';
import { UrlReflectionService                                                                                            } from '@bespunky/angular-zen/router-x';
import { LanguageConfig                                                                                                  } from './language-integration-config';

/** A multi-level route string for. */
export const DeepRoutePath           = '/deeply/nested/route/for/testing';
/**
 * The segments of `DeepRoutePath`. First element will always be '' (empty string) as the route begins with a forward slash.
 * Use `DeepRouteSegmentsNoRoot` for an array of segments without the root ''.
 */
export const DeepRouteSegments       = DeepRoutePath.split('/');
/**
 * The segments of `DeepRoutePath` without the root route (the '' route).
 * Use `DeepRouteSegments` for an array of segments with the root ''.
 */
export const DeepRouteSegmentsNoRoot = DeepRouteSegments.slice(1);

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
export function setupUrlLocalizerTest(strategyOrConfig: UrlLocalizationStrategy | UrlLocalizationConfig)
{
    const nestedRoutes = createDeeplyNestedRoutes(DeepRouteSegments);
    const config       = isUrlLocalizationConfig(strategyOrConfig) ? strategyOrConfig : { strategy: strategyOrConfig } as UrlLocalizationConfig;

    TestBed.configureTestingModule({
        imports: [
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
 * @example
 * ```text
 * The supported routes created by the function if run on ['some', 'route'] will be:
 * /
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
 * ```
 * @export
 * @param {string[]} segments
 * @returns {Route}
 */
export function createDeeplyNestedRoutes(segments: string[]): Route
{
    const parent: Route = {
        path: segments[0], component: NoopComponent, children: [{ path: 'en', component: NoopComponent }]
    };

    if (segments.length > 1)
    {
        const nestedChildren = createDeeplyNestedRoutes(segments.slice(1));
    
        // Add the route tree to the node
        parent.children.push(nestedChildren);
        // Add the route tree to the /en child of the node as well
        parent.children[0].children = [nestedChildren];
    }

    return parent;
}

function isUrlLocalizationConfig(value: any): value is UrlLocalizationConfig
{
    return !!value?.strategy;
}

@Component({
    selector: 'zen-language-noop',
    template: '<div></div>'
})
class NoopComponent { }
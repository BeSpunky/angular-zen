import { Component, NgZone   } from '@angular/core';
import { TestBed             } from '@angular/core/testing';
import { Route, Router       } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

import { UrlLocalizationStrategy, LanguageIntegrationModule, UrlLocalizer, UrlReflectionService, UrlLocalizationService, UrlLocalizationConfig } from '@bespunky/angular-zen/language';
import { LanguageConfig } from './language-integration-config';

export const DeepRoutePath           = '/deeply/nested/route/for/testing';
export const DeepRouteSegments       = DeepRoutePath.split('/');
export const DeepRouteSegmentsNoRoot = DeepRouteSegments.slice(1);

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
    const zone            = TestBed.inject(NgZone);
    
    const navigate      = router.navigate.bind(router);
    const navigateByUrl = router.navigateByUrl.bind(router);

    // Fix for angular's warning of running navigation outside angular's zone
    spyOn(router, 'navigate'     ).and.callFake((...args: any[]) => zone.run(() => navigate     (...args)));
    spyOn(router, 'navigateByUrl').and.callFake((...args: any[]) => zone.run(() => navigateByUrl(...args)));

    router.initialNavigation();

    return { localizer, urlLocalization, urlReflection, router };
}

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
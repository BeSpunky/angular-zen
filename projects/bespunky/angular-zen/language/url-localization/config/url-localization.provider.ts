import { ClassProvider, FactoryProvider, Provider } from '@angular/core';

import { UrlLocalizer                           } from '../localizers/url-localizer';
import { RoutePositionUrlLocalizer              } from '../localizers/route-position-url-localizer';
import { QueryParamsUrlLocalizer                } from '../localizers/query-params-url-localizer';
import { NoopUrlLocalizer                       } from '../localizers/noop-url-localizer';
import { UrlLocalizationConfig, UrlLocalization } from './url-localization-config';
import { UrlReflectionService } from '../services/url-reflection.service';
import { LanguageIntegrationService } from '../../services/language-integration.service';

export const DefaultUrlLocalizationConfig: UrlLocalizationConfig = {
    strategy  : { useClass: NoopUrlLocalizer },
    forceHttps: false
};

export function provideUrlLocalizer(config: UrlLocalizationConfig): ClassProvider | FactoryProvider
{
    const strategy = config?.strategy;

    const strategies: { [type: string]: () => Partial<Provider>; } = {
        // Use route position strategy for numbers
        number   : () => ({ useFactory: (urlReflect, language) => new RoutePositionUrlLocalizer(config, urlReflect, language), deps: [UrlReflectionService, LanguageIntegrationService] }),
        // Use query params strategy for strings
        string   : () => ({ useFactory: (urlReflect) => new QueryParamsUrlLocalizer(config, urlReflect), deps: [UrlReflectionService] }),
        // Use the user's factory or class provider
        object   : () => strategy,
        // Use the noop localizer when nothing provided (in case url localization config is not present)
        undefined: () => ({ useClass: NoopUrlLocalizer })
    };

    // Create a basic provider to which the strategy will be assigned
    const provider: Partial<Provider> = { provide: UrlLocalizer };

    // Override the useClass or useFactory with the detected strategy
    return Object.assign(provider, strategies[typeof strategy]()) as (ClassProvider | FactoryProvider);
}

export function provideUrlLocalization(config?: UrlLocalizationConfig): Provider[]
{
    config = Object.assign({}, DefaultUrlLocalizationConfig, config);

    return [
        { provide: UrlLocalization, useValue: config },
        provideUrlLocalizer(config)
    ];
}

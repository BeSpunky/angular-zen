import { ClassProvider, FactoryProvider, Provider } from '@angular/core';

import { LanguageIntegrationService             } from '../../services/language-integration.service';
import { UrlLocalizer                           } from '../localizers/url-localizer';
import { RoutePositionUrlLocalizer              } from '../localizers/route-position-url-localizer';
import { QueryParamsUrlLocalizer                } from '../localizers/query-params-url-localizer';
import { NoopUrlLocalizer                       } from '../localizers/noop-url-localizer';
import { UrlReflectionService                   } from '../services/url-reflection.service';
import { UrlLocalizationConfig, UrlLocalization } from './url-localization-config';

/**
 * The default configuration for url localization when loading the language integration module.
 * Uses the `NoopUrlLocalizer` as strategy and does not force https. Localization and delocalization will always return an unchanged url url.
 */
export const DefaultUrlLocalizationConfig: UrlLocalizationConfig = {
    strategy  : { useClass: NoopUrlLocalizer },
    forceHttps: false
};

/**
 * Creates the appropriate DI compatible provider for the `UrlLocalizer` class, depending on the strategy specified in the url localization configuration.  
 * If the configured strategy is a number, `RoutePositionUrlLocalizer` will be used.  
 * If the configured strategy is a string, `QueryParamsUrlLocalizer` will be used.  
 * If the configured strategy is a valid `UrlLocalizer` provider, the provider will be used as is.  
 * Otherwise, `NoopUrlLocalizer` will be used.
 * 
 * @export
 * @param {UrlLocalizationConfig} config The url localization configuration holding the strategy.
 * @returns {(ClassProvider | FactoryProvider)} A DI compatible provider for the `UrlLocalizer` class with the implementation appropriate for the specified strategy.
 */
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

/**
 * Creates the providers for the `UrlLocalization` token and the `UrlLocalizer` class.
 *
 * @export
 * @param {UrlLocalizationConfig} [config] (Optional) The configuration for url localization tools. Default is `DefaultUrlLocalizationConfig`.
 * @returns {Provider[]} The providers for the `UrlLocalization` token and the `UrlLocalizer` class.
 */
export function provideUrlLocalization(config?: UrlLocalizationConfig): Provider[]
{
    config = Object.assign({}, DefaultUrlLocalizationConfig, config);

    return [
        { provide: UrlLocalization, useValue: config },
        provideUrlLocalizer(config)
    ];
}

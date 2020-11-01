import { FactoryProvider, Provider } from '@angular/core';

import { UrlLocalizationConfig                          } from '../url-localization/config/url-localization-config';
import { provideUrlLocalization                         } from '../url-localization/config/url-localization.provider';
import { LanguageIntegrationConfig, LanguageIntegration } from './language-integration-config';

/** Represents a factory that receives dependencies and produces the language integration configuration for an app. */
export type LanguageIntegrationConfigFactory = (...deps: any[]) => LanguageIntegrationConfig;

/**
 * A strongly-typed factory provider for providing language integration config.
 *
 * @export
 * @interface LanguageIntegrationProvider
 * @extends {(Omit<FactoryProvider, 'provide' | 'multi'>)}
 */
export interface LanguageIntegrationProvider extends Omit<FactoryProvider, 'provide' | 'multi'>
{
    useFactory      : LanguageIntegrationConfigFactory;
    urlLocalization?: UrlLocalizationConfig;
}

/**
 * Generates language integration tokens and services to be provided in a module.
 * Used by `LanguageIntegrationModule.forRoot()`.
 *
 * @export
 * @param {LanguageIntegrationProvider} config The language integration provider configuration.
 * @returns {Provider[]} An array of providers for language integration.
 */
export function provideLanguageIntegration({ useFactory, deps, urlLocalization }: LanguageIntegrationProvider): Provider[]
{
    return [
        { provide: LanguageIntegration, useFactory, deps },
        ...provideUrlLocalization(urlLocalization)
    ];
}
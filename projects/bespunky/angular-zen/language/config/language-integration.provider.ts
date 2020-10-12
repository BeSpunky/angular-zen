import { FactoryProvider, Provider } from '@angular/core';

import { UrlLocalizationConfig                          } from '../url-localization/config/url-localization-config';
import { provideUrlLocalization                         } from '../url-localization/config/url-localization.provider';
import { LanguageIntegrationConfig, LanguageIntegration } from './language-integration-config';

export type LanguageIntegrationConfigFactory = (...deps: any[]) => LanguageIntegrationConfig;

// Strong-typed factory provider
export interface LanguageIntegrationProvider extends Omit<FactoryProvider, 'provide' | 'multi'>
{
    useFactory      : LanguageIntegrationConfigFactory;
    urlLocalization?: UrlLocalizationConfig;
}

export function provideLanguageIntegration({ useFactory, deps, urlLocalization }: LanguageIntegrationProvider): Provider[]
{
    return [
        { provide: LanguageIntegration, useFactory, deps },
        ...provideUrlLocalization(urlLocalization)
    ];
}
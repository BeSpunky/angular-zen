import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { provideUrlLocalizationConfig, UrlLocalizationConfig     } from './url-localization/url-localization-config';
import { LanguageIntegrationProvider, provideLanguageIntegration } from './config/language-integration-config';

@NgModule()
export class LanguageIntegrationModule
{
    constructor(@Optional() @SkipSelf() parentModule: LanguageIntegrationModule)
    {
        if (parentModule) throw new Error('LanguageIntegrationModule was already loaded.')
    }

    static forRoot(configProvider: LanguageIntegrationProvider, urlLocalization?: UrlLocalizationConfig): ModuleWithProviders<LanguageIntegrationModule>
    {
        return {
            ngModule : LanguageIntegrationModule,
            providers: [
                provideLanguageIntegration  (configProvider),
                provideUrlLocalizationConfig(urlLocalization)
            ]
        };
    }

    static forChild(): ModuleWithProviders<LanguageIntegrationModule>
    {
        return {
            ngModule : LanguageIntegrationModule
        };
    }
}

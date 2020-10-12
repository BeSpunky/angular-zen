import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { provideUrlLocalizationConfig, UrlLocalizationConfig     } from './url-localization/url-localization-config';
import { LanguageIntegrationProvider, provideLanguageIntegration } from "./config/language-integration.provider";

@NgModule()
export class LanguageIntegrationModule
{
    constructor(@Optional() @SkipSelf() parentModule: LanguageIntegrationModule)
    {
        if (parentModule) throw new Error('LanguageIntegrationModule has already been loaded. Import it, once, in your app module using `forRoot()`.')
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
}

import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CoreModule                                              } from '@bespunky/angular-zen/core';
import { LanguageIntegrationProvider, provideLanguageIntegration } from './config/language-integration.provider';

/**
 * Provides services for libraries requiring integration with their user's language services.
 *
 * @export
 * @class LanguageIntegrationModule
 */
@NgModule({
    imports: [CoreModule]
})
export class LanguageIntegrationModule
{
    constructor(@Optional() @SkipSelf() parentModule: LanguageIntegrationModule)
    {
        if (parentModule) throw new Error('`LanguageIntegrationModule` has already been loaded. Import it in your app module using `forRoot()`.');
    }

    /**
     * Generates the language integration modules with the appropriate providers for the app to share its language services with
     * libraries and supporting languages.
     *
     * @static
     * @param {LanguageIntegrationProvider} configProvider The integration configuration. Tells the module how to operate with your language services.
     */
    static forRoot(configProvider: LanguageIntegrationProvider): ModuleWithProviders<LanguageIntegrationModule>
    {
        return {
            ngModule : LanguageIntegrationModule,
            providers: provideLanguageIntegration(configProvider)
        };
    }
}

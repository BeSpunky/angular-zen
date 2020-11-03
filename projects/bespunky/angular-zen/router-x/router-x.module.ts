import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CoreModule                } from '@bespunky/angular-zen/core';
import { RouterXConfig        } from './config/router-x-config';
import { provideRouterXConfig       } from './config/router-x-config.provider';
import { PublishComponentDirective } from './outlet/publish-component.directive';

const exported = [
    PublishComponentDirective
];

/**
 * Provides services for libraries requiring integration with their user's language services.
 *
 * @export
 * @class RouterXModule
 */
@NgModule({
    imports     : [CoreModule],
    declarations: exported,
    exports     : exported
})
export class RouterXModule
{
    constructor(@Optional() @SkipSelf() parentModule: RouterXModule)
    {
        if (parentModule) throw new Error('`RouterXModule` has already been loaded. Import it only once, in your app module using, `forRoot()`.');
    }

    /**
     * Generates the router-x module with the appropriate providers.
     *
     * @static
     * @param {RouterXConfig} config (Optional) The configuration for the router extension module.
     */
    static forRoot(config?: RouterXConfig): ModuleWithProviders<RouterXModule>
    {
        return {
            ngModule : RouterXModule,
            providers: [provideRouterXConfig(config)]
        };
    }

    /**
     * Generates the router-x module for child modules.
     *
     * @static
     */
    static forChild(): ModuleWithProviders<RouterXModule>
    {
        return { ngModule : RouterXModule };
    }
}

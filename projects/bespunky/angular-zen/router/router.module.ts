import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';

import { CoreModule                                              } from '@bespunky/angular-zen/core';

/**
 * Provides services for libraries requiring integration with their user's language services.
 *
 * @export
 * @class RouterModule
 */
@NgModule({
    imports: [CoreModule]
})
export class RouterModule
{
    // constructor(@Optional() @SkipSelf() parentModule: RouterModule)
    // {
    //     if (parentModule) throw new Error('`RouterModule` has already been loaded. Import it in your app module using `forRoot()`.');
    // }

    // /**
    //  * Generates the language integration modules with the appropriate providers for the app to share its language services with
    //  * libraries and supporting languages.
    //  *
    //  * @static
    //  * @param {RouterProvider} configProvider The integration configuration. Tells the module how to operate with your language services.
    //  */
    // static forRoot(configProvider: RouterProvider): ModuleWithProviders<RouterModule>
    // {
    //     return {
    //         ngModule : RouterModule,
    //         providers: provideRouter(configProvider)
    //     };
    // }
}

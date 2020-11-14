import { Directive              } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { RouteAware, RouterOutletComponentBus } from '@bespunky/angular-zen/router-x';
import { LanguageIntegrationService           } from './language-integration.service';

/**
 * Integrates with the `LanguageIntegrationService` and facilitates language related work in route-aware services.
 *
 * @export
 * @abstract
 * @class LocalizedRouteAware
 * @extends {RouteAware}
 */
@Directive() // Decorated as directive so it can also be inherited by components. When using Injectable, angular fails to load an extending component.
export abstract class LocalizedRouteAware extends RouteAware
{
    /**
     * Creates an instance of LocalizedRouteAware.
     * 
     * @param {LanguageIntegrationService} language The instance of the language integration service.
     * @param {Router} router The instance of Angular's router service.
     * @param {ActivatedRoute} route The instance of Angular's activated route service.
     * @param {RouterOutletComponentBus} [componentBus] (Optional) The component bus for router-x functionality.
     * Provide this when you want your route-aware service to have access to the instance(s) of the activated component(s).
     */
    constructor(
        protected language     : LanguageIntegrationService,
                  router       : Router,
                  route        : ActivatedRoute,
                  componentBus?: RouterOutletComponentBus
    )
    {
        super(router, route, componentBus);
        
        if (this.language.enabled) this.initLanguageSupport();
    }

    private initLanguageSupport(): void
    {
        this.subscribe(this.language.ready  , this.onLanguageServicesReady.bind(this));
        this.subscribe(this.language.changed, this.onLanguageChanged.bind(this));
    }
    
    /**
     * Called when the app's language services have initialized and are ready for use.
     * When language integration is disabled, or no ready observable have been provided by the app
     * this will execute immediatelly on construction time.
     * 
     * Override to implement.
     *
     * @virtual
     * @protected
     */
    protected onLanguageServicesReady(): void { }

    /**
     * Called when the current language used by the integrated app has changed. Override to implement.
     * 
     * @virtual
     * @protected
     * @param {*} lang The language code of the new language.
     */
    protected onLanguageChanged(lang: string): void { }
}

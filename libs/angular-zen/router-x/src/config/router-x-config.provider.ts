import { InjectionToken, Provider } from '@angular/core';

import { RouterXConfig } from './router-x-config';

/**
 * An injection token for the provided router configuration.
 * `RouterExModule.forRoot()` facilitates the injection of this token. No need to inject directly.
 */
export const RouterX = new InjectionToken<RouterXConfig>('RouterX.Config');

/** The default configuration for the router-x module. */
export const DefaultRouterXConfig: RouterXConfig = {};

/**
 * Creates a provider for the router-x module configuration.
 * Options not provided will be replaced with their default values according to `DefaultRouterXConfig`.
 *
 * @export
 * @param {RouterXConfig} config
 * @returns {Provider}
 */
export function provideRouterXConfig(config?: RouterXConfig): Provider 
{
    config = Object.assign({}, DefaultRouterXConfig, config);

    return { provide: RouterX, useValue: config }
}
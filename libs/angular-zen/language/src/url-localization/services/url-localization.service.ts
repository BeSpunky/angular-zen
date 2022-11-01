import { Inject, Injectable } from '@angular/core';

import { UrlReflectionService                   } from '@bespunky/angular-zen/router-x';
import { UrlLocalization, UrlLocalizationConfig } from '../config/url-localization-config';
import { UrlLocalizer                           } from '../localizers/url-localizer';

/**
 * Provides tools for localization and delocalization of the currently navigated url taking into
 * account the url localization configuration provided when importing the language integration module.
 * 
 * @export
 * @class UrlLocalizationService
 */
@Injectable({ providedIn: 'root' })
export class UrlLocalizationService
{
    /**
     * Creates an instance of UrlLocalizationService.
     *
     * @param {UrlLocalizationConfig} config The url localization configuration provided for the `UrlLocalization` token.
     * @param {UrlReflectionService} urlReflection The url reflection service.
     * @param {UrlLocalizer} localizer The url localizer which will actually do the localization work.
     * The instance and implementation depend on the strategy configured for url localization when importing the language integration module.
     */
    constructor(
        @Inject(UrlLocalization) private         config       : UrlLocalizationConfig,
                                 private         urlReflection: UrlReflectionService,
                                 public readonly localizer    : UrlLocalizer
    ) { }
    
    /**
     * Localizes the currently navigated url using the configured localization strategy and forces https if needed.
     *
     * @param {string} lang The langugae to localize the currently navigated url to.
     * @returns {string} The localized currently navigated url.
     */
    public localize(lang: string): string
    {
        return this.replaceHttpIfRequired(this.localizer.localize(lang));
    }
    
    /**
     * Delocalizes the currently navigated url using the configured localization strategy and forces https if needed.
     *
     * @returns {string} The delocalized currently navigated url.
     */
    public delocalize(): string
    {        
        return this.replaceHttpIfRequired(this.localizer.delocalize());
    }

    /**
     * Generates a localized version of the currently navigate url for each of the specified languages using the configured localization strategy.
     * 
     * @param {string[]} langs The languages for which to generate the localized urls.
     * @returns {{ [lang: string]: string }[]} An array of { [lang]: url } containing an object for each language and its corresponding localized url.
     */
    public generateLocalizedUrls(langs: string[]): { [lang: string]: string }[]
    {
        return langs.map(lang => ({ [lang]: this.localizer.localize(lang) }));
    }

    private replaceHttpIfRequired(url: string): string
    {
        return this.config?.forceHttps ? this.urlReflection.forceHttps(url) : url;
    }
}
import { Injectable } from '@angular/core';

import { UrlReflectionService } from '@bespunky/angular-zen/router-x';

/**
 * The base class for url localization implementors. This can be used as an injectable token to get a hold of the currently
 * configured url localizer class.
 *
 * @export
 * @abstract
 * @class UrlLocalizer
 */
@Injectable()
export abstract class UrlLocalizer
{
    /**
     * Creates an instance of UrlLocalizer.
     * 
     * @param {UrlReflectionService} urlReflection The url reflection service.
     */
    constructor(protected urlReflection: UrlReflectionService) { }

    /**
     * Reads the currently navigated url and localizes it to the specified language.
     * If the url is already localized with a different language, updates the language.
     * If the url is already localized with the specified language, returns the url unchanged.
     * 
     * @abstract
     * @param {string} lang The language code to use for localization (e.g. 'en', 'fr', 'en-US', 'es-CL').
     * @returns {string} The localized url.
     */
    public abstract localize(lang: string): string;

    /**
     * Reads the Currently navigated url and delocalizes it.
     * If the url is already delocalized, return the url unchanged.
     *
     * @abstract
     * @returns {string} The delocalized url.
     */
    public abstract delocalize(): string;
}

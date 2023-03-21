import { Injectable } from '@angular/core';

import { UrlLocalizer } from './url-localizer';

/**
 * A noop implemetation for the `UrlLocalizer` class.
 * Always returns unchanged urls.
 *
 * @export
 * @class NoopUrlLocalizer
 * @extends {UrlLocalizer}
 */
@Injectable({ providedIn: 'root'})
export class NoopUrlLocalizer extends UrlLocalizer
{
    /**
     * Returns the currently navigated url as is.
     *
     * @param {string} lang Ignore.
     * @returns {string} The currently navigated url as is.
     */
    localize(lang: string): string
    {
        return this.urlReflection.fullUrl;
    }
    
    /**
     * Returns the currently navigated url as is.
     *
     * @returns {string} The currently navigated url as is.
     */
    delocalize(): string
    {
        return this.urlReflection.fullUrl;
    }
}
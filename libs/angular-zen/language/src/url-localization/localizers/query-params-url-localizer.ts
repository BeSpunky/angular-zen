import { Inject, Injectable } from '@angular/core';
import { UrlTree            } from '@angular/router';

import { UrlReflectionService                   } from '@bespunky/angular-zen/router-x';
import { UrlLocalization, UrlLocalizationConfig } from '../config/url-localization-config';
import { UrlLocalizer                           } from './url-localizer';

/**
 * Provides tools for localization and delocalization of the currently navigated url by adding or removing
 * a named query param dedicated for language.
 *
 * @export
 * @class QueryParamsUrlLocalizer
 * @extends {UrlLocalizer}
 */
@Injectable({ providedIn: 'root'})
export class QueryParamsUrlLocalizer extends UrlLocalizer
{
    /**
     * The name of the query parameter specifying the language.
     *
     * @type {string}
     */
    public readonly paramName: string;

    constructor(@Inject(UrlLocalization) { strategy }: UrlLocalizationConfig, urlReflection: UrlReflectionService)
    {
        super(urlReflection);

        this.paramName = strategy as string;
    }

    /**
     * Localizes the currently navigated url by adding or updating the query param specifying the language.
     *
     * @param {string} lang The new language of the url.
     * @returns {string} The currently navigated url localized into the specified language.
     */
    localize(lang: string): string
    {
        const currentUrlTree    = this.parseUrlTree();
        const localizedParams   = this.replaceLanguageParam(this.urlReflection.queryParams, lang);
        const localizedRoute    = this.replaceQueryParamsInUrlTree(currentUrlTree, localizedParams);
        const localizedRouteUrl = this.urlReflection.router.serializeUrl(localizedRoute);

        return this.composeUrl(localizedRouteUrl);
    }
    
    /**
     * Delocalizes the currently navigated url by removing the query param specifying the language.
     *
     * @returns {string} The currently navigated url without the query param for language.
     */
    delocalize(): string
    {
        return this.localize('');
    }

    /**
     * Returns the `UrlTree` representing the currently navigated url.
     *
     * @protected
     * @returns {UrlTree} The `UrlTree` representing the currently navigated url.
     */
    protected parseUrlTree(): UrlTree
    {
        const { router } = this.urlReflection;

        // Parsing the url seems dumb as the router should have it parsed already, but the route object doesn't hold
        // the tree and the router SOMETIMES holds it in getCurrentNavigation().
        return router.parseUrl(router.url);
    }

    /**
     * Updates the language param in a query params object.
     *
     * @protected
     * @param {*} params The object representing the query params.
     * @param {string} lang The new language to set to the language query param. If `null` or `undefined`, the language query param will be deleted from the object.
     * @returns {*} The updated query params object.
     */
    protected replaceLanguageParam(params: any, lang: string): any
    {
        if (lang)
            params[this.paramName] = lang;
        else
            delete params[this.paramName];

        return params;
    }

    /**
     * Replaces the query params in a url tree object.
     *
     * @protected
     * @param {UrlTree} url The url tree in which query params should be replaced.
     * @param {Object} newParams The new query params object to set to the url tree.
     * @returns {UrlTree} The updated url tree object.
     */
    protected replaceQueryParamsInUrlTree(url: UrlTree, newParams: { [k: string]: any }): UrlTree
    {
        return Object.assign(url, { queryParams: newParams });
    }

    /**
     * Concats the host url and the specified route url to compose a fully qualified url.
     * Uses the host url provided by the url reflection service.
     * 
     * @protected
     * @param {string} routeUrl The route url to concat to the host url. Should be prefixed with '/'.
     * @returns {string} The fully qualified url composed of the host url defined by the url reflection service and the specified route url.
     */
    protected composeUrl(routeUrl: string): string
    {      
        const { hostUrl } = this.urlReflection;

        return `${hostUrl}${routeUrl}`;
    }
}
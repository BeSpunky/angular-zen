import { Inject, Injectable, Optional } from '@angular/core';
import { ActivatedRoute, Router       } from '@angular/router';

import { DocumentRef   } from '@bespunky/angular-zen/core';
import { RouterXConfig } from '../config/router-x-config';
import { RouterX       } from '../config/router-x-config.provider';

/**
 * Provides tools for breaking the current and any url to their different parts.
 *
 * @export
 * @class UrlReflectionService
 */
@Injectable({ providedIn: 'root'})
export class UrlReflectionService
{
    /**
     * A regular expression to match the route part of a url. The url can be fully qualified or start at the route.
     * The extracted group will be named 'route'.
     * 
     * @example
     * The regex will extract '/this/is/the/route' for all of the following:
     *
     * Fully qualified urls:
     * `https://some.website.com/this/is/the/route?a=1&b=2&c=3`
     * `https://some.website.com/this/is/the/route#someFragment`
     * `https://some.website.com/this/is/the/route?debug=true#fragment`
     * 
     * Relative routes:
     * `/this/is/the/route?a=1&b=2&c=3`
     * `/this/is/the/route#someFragment`
     * `/this/is/the/route?debug=true#fragment`
     * 
     * The regex will extract 'this/is/the/route' (no head slash) for all of the following:
     * `this/is/the/route?a=1&b=2&c=3`
     * `this/is/the/route#someFragment`
     * `this/is/the/route?debug=true#fragment`
     **/
    public readonly RouteRegex         = /^(?:http[s]?:\/\/[^\/]+)?(?<route>[^?#]+)(?=[?#]|$)/;
    /**
     * A regular expression to match all segments of a route.
     * Looks for `/<segment>/` parts and extract them without the slashes.
     * The extracted groups will be named 'segment'.
     */
    public readonly RouteSegmentsRegex = /(?!\/)(?<segment>[^\/]+)/g;
    /**
     * A regular expression to match the question mark and everything that follows in a url.
     * The extracted group will be named 'queryString'.
     * 
     * @example
     * The regex will extract '?a=1&b=2&c=3' for all of the following:
     * https://some.website.com/some/route?a=1&b=2&c=3
     * https://some.website.com/some/route?a=1&b=2&c=3#fragment
     * /some/route?a=1&b=2&c=3#fragment
     * ?a=1&b=2&c=3#fragment
     */
    public readonly QueryStringRegex   = /(?<queryString>\?[^#]*)/;
    /**
     * A regular expression to match the hash sign and everything that follows in a url.
     * The extracted group will be named 'fragment'.
     * 
     * @example
     * The regex will extract '#fragment' for all of the following:
     * https://some.website.com/some/route?a=1&b=2&c=3#fragment
     * /some/route?a=1&b=2&c=3#fragment
     * some/route?a=1&b=2&c=3#fragment
     */
    public readonly FragmentRegex      = /(?<fragment>\#.*)$/;

    /**
     * The complete host portion (e.g. https://www.example.com) of the currently navigated url as fetched from the `document.location` object.
     * If the `hostUrl` option was provided when importing the language integration module, it will be used instead.
     *
     * @type {string}
     */
    public readonly hostUrl: string;

    constructor(
                                     private          document: DocumentRef,
                                     public  readonly router  : Router,
                                     public  readonly route   : ActivatedRoute,
        @Optional() @Inject(RouterX) private          config? : RouterXConfig
    )
    {
        const hostUrl = this.config?.hostUrl;

        // If the hostUrl has been provided by the user, use it; otherwise, fetch from the location service
        this.hostUrl = hostUrl || this.document.nativeDocument.location.origin;
    }
    
    /**
     * Extracts the route portion of a given url.
     * 
     * @example
     * routeOf('https://some.website.com/some/route?a=1&b=2&c=3') === '/some/route'
     *
     * @param {string} url The url for which to extract the route portion.
     * @returns {string} The route portion of the url.
     */
    public routeOf(url: string): string
    {
        return url.match(this.RouteRegex).groups?.route;
    }
    
    /**
     * Extracts the route portion of a url as an array of route segments, not including the empty root segment.
     *
     * @example
     * routeSegmentsOf('https://some.website.com/some/route?a=1&b=2&c=3') === ['some', 'route']
     * routeSegmentsOf('/some/route') === ['some', 'route']
     *
     * @param {string} routeOrUrl The route or complete url from which to extract the route segments.
     * @returns {string[]} The segments of the route.
     */
    public routeSegmentsOf(routeOrUrl: string): string[]
    {
        // Extract the route portion only, then match with the regex to extract the array of segments
        return this.routeOf(routeOrUrl).match(this.RouteSegmentsRegex) || [];
    }

    /**
     * Extracts the query string of a specified url.
     *
     * @example
     * queryStringOf('https://some.website.com/some/route?a=1&b=2&c=3') === '?a=1&b=2&c=3'
     *
     * @param {string} url The url from which to extract the query string.
     * @returns {string} The query string extracted from the url.
     */
    public queryStringOf(url: string): string
    {
        const matches = url.match(this.QueryStringRegex) || [''];

        return matches[0];
    }

    /**
     * Removes the query portion of a url.
     *
     * @example
     * stripQuery('https://some.website.com/some/route?a=1&b=2&c=3#fragment') === 'https://some.website.com/some/route#fragment'
     *
     * @param {string} url The url from which to remove the query.
     * @returns {string} The specified url without the query portion.
     */
    public stripQuery(url: string): string
    {
        return url.replace(this.QueryStringRegex, '');
    }
    
    /**
     * Extracts the fragment from a url.
     *
     * @example
     * fragmentOf('https://some.website.com/some/route?a=1&b=2&c=3#fragment') === '#fragment'
     *
     * @param {string} url The url from which to extract the fragment.
     * @returns {string} The fragment extracted from the url.
     */
    public fragmentOf(url: string): string
    {
        const matches = url.match(this.FragmentRegex) || [''];

        return matches[0];
    }

    /**
     * Removes the fragment portion of a url.
     *
     * @example
     * stripFragment('https://some.website.com/some/route?a=1&b=2&c=3#fragment') === 'https://some.website.com/some/route?a=1&b=2&c=3'
     * 
     * @param {string} url The url to remove the fragment.
     * @returns {string} The url without the fragment portion.
     */
    public stripFragment(url: string): string
    {
        return url.replace(this.FragmentRegex, '');
    }

    /**
     * Makes sure the url is prefixed with https instead of http.
     *
     * @param {string} url The url to secure.
     * @returns {string} The secure url.
     */
    public forceHttps(url: string): string
    {
        return url.replace(/^http:\/\//, 'https://');
    }

    /**
     * The fully qualified url of the currently navigated route (e.g. 'https://some.website.com/some/route?a=1&b=2&c=3#fragment').
     *
     * @readonly
     * @type {string}
     */
    public get fullUrl(): string
    {
        return `${this.hostUrl}${this.router.url}`;
    }
    
    /**
     * The route url of the currently navigated route (e.g. '/some/route').
     *
     * @readonly
     * @type {string}
     */
    public get routeUrl(): string
    {
        return this.routeOf(this.router.url);
    }
    
    /**
     * The segments of the currently navigated route (e.g. ['some', 'route']).
     *
     * @readonly
     * @type {string[]}
     */
    public get routeSegments(): string[]
    {
        return this.routeSegmentsOf(this.routeUrl);
    }

    /**
     * The object representing the query params in the currently navigated route.
     *
     * @readonly
     * @type {*}
     */
    public get queryParams(): any
    {
        return { ...this.route.snapshot.queryParams };
    }

    /**
     * The query string portion of the currently navigated route (e.g. '?a=1&b=2&c=3').
     *
     * @readonly
     * @type {string}
     */
    public get queryString(): string
    {
        return this.queryStringOf(this.router.url);
    }

    /**
     * The fragment portion of the currently navigated route, without the hash sign (e.g. 'fragment').
     *
     * @readonly
     * @type {string}
     */
    public get fragment(): string
    {
        return this.route.snapshot.fragment;
    }

    /**
     * The fragment portion of the currently navigated route, with the hash sign (e.g. '#fragment').
     *
     * @readonly
     * @type {string}
     */
    public get fragmentString(): string
    {
        return `#${this.fragment}`;
    }
}

import { Inject, Injectable     } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DocumentRef                            } from '@bespunky/angular-zen/core';
import { UrlLocalization, UrlLocalizationConfig } from '../config/url-localization-config';

// TODO: Decouple reflection service from localization. Move to a new @bespunky/angular-zen/router module.
// The language module will use that new router module for localization. Router module will present a new HostUrl token.

@Injectable({ providedIn: 'root'})
export class UrlReflectionService
{
    /**
     * A regular expression to match the question mark and everything that follows in a url.
     * The extracted group will be named 'queryString'.
     * 
     * @example
     * The regex will extract '?a=1&b=2&c=3' for all of the following:
     * https://some.website.com/some/route?a=1&b=2&c=3
     * https://some.website.com/some/route?a=1&b=2&c=3#fragment
     */
    public readonly QueryStringRegex   = /(?<queryString>\?[^#]*)/;
    /**
     * A regular expression to match the route part of a fully qualified url.
     * The extracted group will be named 'route'.
     * 
     * @example
     * The regex will extract '/this/is/the/route' for all of the following:
     * https://some.website.com/this/is/the/route?a=1&b=2&c=3
     * https://some.website.com/this/is/the/route#someFragment
     * https://some.website.com/this/is/the/route?debug=true#fragment
     */
    public readonly RouteRegex         = /(?:http[s]?:\/\/[^\/]+)(?<route>[^?#]+)(?=[?#]|$)/;
    /**
     * A regular expression to match all segments of a route.
     * Looks for /<segment>/ parts and extract them without the slashes.
     * The extracted groups will be named 'segment'.
     */
    public readonly RouteSegmentsRegex = /(?!\/)(?<segment>[^\/]+)/g;

    public readonly hostUrl: string;

    constructor(
        @Inject(UrlLocalization) private          config  : UrlLocalizationConfig,
                                 private          document: DocumentRef,
                                 public  readonly router  : Router,
                                 public  readonly route   : ActivatedRoute,
    )
    {
        const hostUrl = this.config?.hostUrl;

        // If the hostUrl has been provided by the user, use it; otherwise, fetch from the location service
        this.hostUrl = hostUrl || this.document.nativeDocument.location.origin;
    }

    public queryStringOf(url: string): string
    {
        const matches = url.match(this.QueryStringRegex) || [''];

        return matches[0];
    }

    public routeOf(url: string): string
    {
        return url.match(this.RouteRegex).groups?.route;
    }

    public routeSegmentsOf(routeOrUrl: string): string[]
    {
        // If this is a fully qualified url, extract the route first
        if (/^http[s]?:\/\//.test(routeOrUrl)) routeOrUrl = this.routeOf(routeOrUrl);

        return routeOrUrl.match(this.RouteSegmentsRegex) || [];
    }

    public stripQuery(url: string): string
    {
        return url.replace(this.QueryStringRegex, '');
    }

    public get fullUrl(): string
    {
        return `${this.hostUrl}${this.router.url}`;
    }

    public get queryParams(): any
    {
        return Object.assign({}, this.route.snapshot.queryParams);
    }

    public get queryString(): string
    {
        return this.queryStringOf(this.router.url);
    }

    public get routeUrl(): string
    {
        return this.stripQuery(this.router.url);
    }

    public get routeSegments(): string[]
    {
        return this.routeSegmentsOf(this.routeUrl);
    }
}

import { ActivatedRouteSnapshot, Router } from '@angular/router';

export class UrlLocalizationState
{
    // Detects the question mark and everything that follows
    private readonly QueryRegEx = /\?.*/;

    constructor(
        public hostUrl           : string,
        public router            : Router,
        public route             : ActivatedRouteSnapshot,
        public supportedLanguages: string[]
    ) { }

    public get fullUrl(): string
    {
        return `${this.hostUrl}${this.router.url}`;
    }

    public get queryParams(): any
    {
        return Object.assign({}, this.route.queryParams);
    }

    public get queryString(): string
    {
        const { url } = this.router;

        const matches = url.match(this.QueryRegEx) || [''];

        return matches[0];
    }

    public get routeUrl(): string
    {
        const { url }       = this.router;

        return url.replace(this.QueryRegEx, '');
    }

    public get routeSegments(): string[]
    {
        // Look for /<segment>/ parts and extract them without the slashes
        const segmentsExp = /(?!\/)(?<segment>[^\/]+)/g;

        return this.routeUrl.match(segmentsExp) || [];
    }
}

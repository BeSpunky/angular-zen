import { UrlTree } from '@angular/router';

import { UrlLocalizationState } from '../services/url-localization-state';
import { UrlLocalizer         } from './url-localizer';

export class QueryParamsUrlLocalizer extends UrlLocalizer
{
    constructor(public readonly paramName: string) { super(); }

    localize(lang: string, state: UrlLocalizationState): string
    {
        const currentUrlTree    = this.parseUrlTree(state);
        const localizedParams   = this.replaceLanguageParam(state.queryParams, lang);
        const localizedRoute    = this.replaceQueryParamsInUrlTree(currentUrlTree, localizedParams);
        const localizedRouteUrl = state.router.serializeUrl(localizedRoute);

        return this.composeUrl(localizedRouteUrl, state);
    }
    
    delocalize(state: UrlLocalizationState): string
    {
        return this.localize(undefined, state);
    }

    protected parseUrlTree({ router }: UrlLocalizationState): UrlTree
    {        
        // Parsing the url seems dumb as the router should have it parsed already, but the route object doesn't hold
        // the tree and the router SOMETIMES holds it in getCurrentNavigation().
        return router.parseUrl(router.url);
    }

    protected replaceLanguageParam(params: any, lang: string): any
    {
        if (lang)
            params[this.paramName] = lang;
        else
            delete params[this.paramName];

        return params;
    }

    protected replaceQueryParamsInUrlTree(url: UrlTree, newParams: Object): UrlTree
    {
        return Object.assign(url, { queryParams: newParams });
    }

    protected composeUrl(routeUrl: string, { hostUrl }: UrlLocalizationState): string
    {      
        return `${hostUrl}${routeUrl}`;
    }
}
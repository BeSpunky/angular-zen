import { Inject, Injectable } from '@angular/core';
import { UrlTree            } from '@angular/router';

import { UrlLocalization, UrlLocalizationConfig } from '../config/url-localization-config';
import { UrlReflectionService                   } from '../services/url-reflection.service';
import { UrlLocalizer                           } from './url-localizer';

@Injectable({ providedIn: 'root'})
export class QueryParamsUrlLocalizer extends UrlLocalizer
{
    public readonly paramName: string;

    constructor(@Inject(UrlLocalization) { strategy }: UrlLocalizationConfig, urlReflection: UrlReflectionService)
    {
        super(urlReflection);

        this.paramName = strategy as string;
    }

    localize(lang: string): string
    {
        const currentUrlTree    = this.parseUrlTree();
        const localizedParams   = this.replaceLanguageParam(this.urlReflection.queryParams, lang);
        const localizedRoute    = this.replaceQueryParamsInUrlTree(currentUrlTree, localizedParams);
        const localizedRouteUrl = this.urlReflection.router.serializeUrl(localizedRoute);

        return this.composeUrl(localizedRouteUrl);
    }
    
    delocalize(): string
    {
        return this.localize(undefined);
    }

    protected parseUrlTree(): UrlTree
    {
        const { router } = this.urlReflection;

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

    protected composeUrl(routeUrl: string): string
    {      
        const { hostUrl } = this.urlReflection;

        return `${hostUrl}${routeUrl}`;
    }
}
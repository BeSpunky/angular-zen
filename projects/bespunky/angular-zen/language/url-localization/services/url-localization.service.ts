import { Inject, Injectable } from '@angular/core';

import { UrlLocalization, UrlLocalizationConfig } from '../config/url-localization-config';
import { UrlLocalizer                           } from '../localizers/url-localizer';

@Injectable({ providedIn: 'root' })
export class UrlLocalizationService
{
    constructor(
        @Inject(UrlLocalization) private         config       : UrlLocalizationConfig,
                                 public readonly localizer    : UrlLocalizer
    ) { }

    public generateLocalizedUrls(langs: string[]): ({})[]
    {
        return langs.map(lang => ({ [lang]: this.localizer.localize(lang) }));
    }

    public localize(lang: string): string
    {
        return this.replaceHttpIfRequired(this.localizer.localize(lang));
    }

    public delocalize(): string
    {        
        return this.replaceHttpIfRequired(this.localizer.delocalize());
    }

    public replaceHttpIfRequired(url: string): string
    {
        return this.config?.forceHttps ? url.replace(/^http:\/\//, 'https://') : url;
    }
}
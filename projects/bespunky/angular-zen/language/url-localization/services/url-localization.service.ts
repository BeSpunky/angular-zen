import { Inject, Injectable } from '@angular/core';

import { UrlLocalization, UrlLocalizationConfig } from '../config/url-localization-config';
import { UrlLocalizer                           } from '../localizers/url-localizer';
import { UrlReflectionService                   } from './url-reflection.service';

@Injectable({ providedIn: 'root' })
export class UrlLocalizationService
{
    constructor(
        @Inject(UrlLocalization) private         config       : UrlLocalizationConfig,
                                 private         urlReflection: UrlReflectionService,
                                 public readonly localizer    : UrlLocalizer
    ) { }
    
    public localize(lang: string): string
    {
        return this.replaceHttpIfRequired(this.localizer.localize(lang));
    }
    
    public delocalize(): string
    {        
        return this.replaceHttpIfRequired(this.localizer.delocalize());
    }

    public generateLocalizedUrls(langs: string[]): ({})[]
    {
        return langs.map(lang => ({ [lang]: this.localizer.localize(lang) }));
    }

    private replaceHttpIfRequired(url: string): string
    {
        return this.config?.forceHttps ? this.urlReflection.forceHttps(url) : url;
    }
}
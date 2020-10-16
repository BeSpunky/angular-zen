import { Injectable } from '@angular/core';

import { UrlLocalizer } from './url-localizer';

@Injectable({ providedIn: 'root'})
export class NoopUrlLocalizer extends UrlLocalizer
{
    localize(lang: string): string
    {
        return this.urlReflection.fullUrl;
    }
    
    delocalize(): string
    {
        return this.urlReflection.fullUrl;
    }
}
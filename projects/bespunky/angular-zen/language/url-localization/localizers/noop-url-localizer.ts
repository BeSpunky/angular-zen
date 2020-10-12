import { Injectable } from '@angular/core';

import { UrlLocalizationState } from '../services/url-localization-state';
import { UrlLocalizer         } from './url-localizer';

@Injectable({ providedIn: 'root'})
export class NoopUrlLocalizer extends UrlLocalizer
{
    localize(lang: string, state: UrlLocalizationState): string
    {
        return state.hostUrl + state.router.url;
    }
    
    delocalize(state: UrlLocalizationState): string
    {
        return state.hostUrl + state.router.url;
    }
}
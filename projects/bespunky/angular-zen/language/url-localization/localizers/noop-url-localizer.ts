import { UrlLocalizationState } from '../services/url-localization-state';
import { UrlLocalizer         } from './url-localizer';

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
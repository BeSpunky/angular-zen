import { UrlLocalizationState } from '../url-localization-state';
import { UrlLocalizer         } from './url-localizer';

export class NoopUrlLocalizer implements UrlLocalizer
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
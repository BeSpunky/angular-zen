import { Injectable } from '@angular/core';

import { UrlLocalizationState } from '../services/url-localization-state';

@Injectable()
export abstract class UrlLocalizer
{
    public abstract localize(lang: string, state: UrlLocalizationState): string;

    public abstract delocalize(state: UrlLocalizationState): string;
}

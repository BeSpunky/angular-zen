import { Injectable, Inject, Optional } from '@angular/core';
import { Router, ActivatedRoute       } from '@angular/router';
import { DocumentRef                  } from '@bespunky/angular-zen/core';

import { LanguageIntegrationService } from '../../services/language-integration.service';
import { UrlLocalization, UrlLocalizationConfig      } from '../config/url-localization-config';
import { UrlLocalizer               } from '../localizers/url-localizer';
import { UrlLocalizationState       } from './url-localization-state';

@Injectable({ providedIn: 'root' })
export class UrlLocalizationService
{
    public readonly hostUrl: string;

    constructor(
                                 private         language : LanguageIntegrationService,
                                 private         router   : Router,
                                 private         route    : ActivatedRoute,
                                 private         document : DocumentRef,
                                 private         localizer: UrlLocalizer,
        @Inject(UrlLocalization) public readonly config?  : UrlLocalizationConfig
    )
    {
        const hostUrl = this.config?.hostUrl;

        // If the hostUrl has been provided by the user, use it; otherwise, fetch from the location service
        this.hostUrl = hostUrl || this.document.nativeDocument.location.origin;
    }

    public generateLocalizedUrls(langs: string[], state: UrlLocalizationState = this.state()): ({})[]
    {
        return langs.map(lang => ({ [lang]: this.localize(lang, state) }));
    }
    
    public state(): UrlLocalizationState
    {
        return new UrlLocalizationState(
            this.hostUrl,
            this.router,
            this.route.snapshot,
            this.language.supportedLanguages
        );
    }

    public localize(lang: string, state: UrlLocalizationState = this.state()): string
    {
        const localized = this.localizer.localize(lang, state);

        return this.replaceHttpIfRequired(localized);
    }

    public delocalize(state: UrlLocalizationState = this.state()): string
    {
        const localized = this.localizer.delocalize(state);
        
        return this.replaceHttpIfRequired(localized);
    }

    public replaceHttpIfRequired(url: string): string
    {
        return this.config?.forceHttps ? url.replace(/^http:\/\//, 'https://') : url;
    }
}
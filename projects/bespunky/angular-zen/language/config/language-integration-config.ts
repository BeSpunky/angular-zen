import { Observable     } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { SupportedLanguagesFactory, DefaultLanguageFactory, TranslationFn, ObservableLike } from './language-integration-types';

export interface LanguageIntegrationConfig
{
    supported: string[] | SupportedLanguagesFactory;
    default  : string   | DefaultLanguageFactory,
    ready?   : ObservableLike<any>;
    changed  : Observable<string>;
    translate: TranslationFn;
}

export const LanguageIntegration = new InjectionToken<LanguageIntegrationConfig>('LanguageIntegration.Config');

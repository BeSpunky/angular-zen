import { of } from 'rxjs';
import { LanguageIntegrationConfig } from '@bespunky/angular-zen/language';

export const SupportedLanguages = ['en', 'fr', 'he'];
export const DefaultLanguage    = SupportedLanguages[0];

export const LanguageConfig: LanguageIntegrationConfig = {
    changed  : of(DefaultLanguage),
    supported: SupportedLanguages,
    default  : DefaultLanguage,
    translate: (value: string) => `TRANSLATED: ${value}`,
    ready    : of(true)
};

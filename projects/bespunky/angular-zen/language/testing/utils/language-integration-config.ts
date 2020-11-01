import { of } from 'rxjs';
import { LanguageIntegrationConfig } from '@bespunky/angular-zen/language';

/** A dummy array of supported languages to use when testing. Includes 'en', 'fr' and 'he'. */
export const SupportedLanguages = ['en', 'fr', 'he'];
/** A dummy language name to use as a default language when testing. This always equals to `SupportedLanguages[0]`. */
export const DefaultLanguage    = SupportedLanguages[0];

/**
 * A dummy language integration configuration to use when testing.
 * 
 * Operation:  
 * 
 * `changed`   - will only emit once, and will provide `DefaultLanguage` as the emitted language.  
 * 
 * `supported` - will provide `SupportedLanguages` as the array of language names.  
 * 
 * `default`   - will provide `DefaultLanguage` as the name of the default language.  
 * 
 * `translate` - will prefix any given value with `TRANSLATED: `.  
 * 
 * `ready`     - will emit once immediately.  
 */
export const LanguageConfig: LanguageIntegrationConfig = {
    changed  : of(DefaultLanguage),
    supported: SupportedLanguages,
    default  : DefaultLanguage,
    translate: (value: string) => `TRANSLATED: ${value}`,
    ready    : of(true)
};

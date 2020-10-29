import { Observable     } from 'rxjs';
import { InjectionToken } from '@angular/core';

import { SupportedLanguagesFactory, DefaultLanguageFactory, TranslationFn, ObservableLike } from './language-integration-types';

/**
 * Configuration for integrating language services into a library.
 * Used in `LanguageIntegrationModule.forRoot()`.
 *
 * @export
 * @interface LanguageIntegrationConfig
 */
export interface LanguageIntegrationConfig
{
    /**
     * The languages supported by the integrated app (e.g. 'en', 'fr', 'en-US', 'es-CL').
     * This can be a local array or a resolvable async factory which returns the language names.
     * 
     * When providing a factory returning an observable, it is the app's responsability to provide an auto completing observable.
     * A common way would be to pipe `take(1)` to make the observable complete after one emission.
     * 
     * Observables left open will cause memory leaks in the language integration service.
     * 
     * @type {(string[] | SupportedLanguagesFactory)}
     */
    supported: string[] | SupportedLanguagesFactory;
    /**
     * The default language used by the integrated app (e.g. 'en', 'fr', 'en-US', 'es-CL').
     * This can be a local array or a resolvable async factory which returns the language names.
     *
     * When providing a factory returning an observable, it is the app's responsability to provide an auto completing observable.
     * A common way would be to pipe `take(1)` to make the observable complete after one emission.
     * 
     * Observables left open will cause memory leaks in the language integration service.
     *
     * @type {(string | DefaultLanguageFactory)}
     */
    default: string | DefaultLanguageFactory;
    /**
     * (Optional) A resolvable async object which emits once, when the intgrated language services are ready for operation.
     * 
     * Provide a value if you need to control and delay the execution of language related operations.
     * 
     * @type {ObservableLike<any>}
     */
    ready?: ObservableLike<any>;
    /**
     * A subscribable object which emits every time the integrated app has changed the current language.
     * The observable should emit the new language name  (e.g. 'en', 'fr', 'en-US', 'es-CL').
     *
     * @type {Observable<string>}
     */
    changed: Observable<string>;
    /**
     * The function used for live translation.
     *
     * @type {TranslationFn}
     */
    translate: TranslationFn;
}

export const LanguageIntegration = new InjectionToken<LanguageIntegrationConfig>('LanguageIntegration.Config');

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { from, of, Observable         } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';

import { Destroyable                                    } from '@bespunky/angular-zen/core';
import { access                                         } from '@bespunky/angular-zen/utils';
import { LanguageIntegrationConfig, LanguageIntegration } from '../config/language-integration-config';

/**
 * Uses the language integration configuration provided by an app to provide language services for a library.
 * @see `LanguageIntegrationModule.forRoot()`.
 * 
 * @export
 * @class LanguageIntegrationService
 * @extends {Destroyable}
 */
@Injectable({ providedIn: 'root' })
export class LanguageIntegrationService extends Destroyable
{
    private $ready!        : Observable<void>;
    private defaultLang?   : string;
    private supportedLangs?: string[];
    private currentLang?   : string;

    /**
     * Creates an instance of LanguageIntegrationService.
     * 
     * @param {LanguageIntegrationConfig} [config] The language integration configuration provided using `LanguageIntegrationModule.forRoot()`.
     */
    constructor(@Optional() @Inject(LanguageIntegration) public readonly config?: LanguageIntegrationConfig)
    {
        super();

        this.initReadyObservable();

        if (config) this.initMultiLanguageSupport();
    }
    
    private initReadyObservable(): void
    {
        const ready = this.config?.ready;

        // Using of() instead of EMPTY as EMPTY only calls `complete` but not `next`.
        // This allows users to subscribe more intuitively.
        this.$ready = ready ? from(ready) : of();
    }

    private initMultiLanguageSupport(): void
    {
        this.subscribe(this.config!.changed, lang => this.currentLang = lang);

        // User's responsability to provide a completing observables.
        this.loadDefaultLanguage   ().subscribe(defaultLang => this.defaultLang    = defaultLang);
        this.loadSupportedLanguages().subscribe(languages   => this.supportedLangs = languages);
    }

    private loadDefaultLanguage(): Observable<string>
    {
        const defaultLang = this.config!.default;
    
        return typeof defaultLang === 'string' ? of(defaultLang) : from(defaultLang());
    }

    private loadSupportedLanguages(): Observable<string[]>
    {
        const supported = this.config!.supported;
        
        return Array.isArray(supported) ? of(supported) : from(supported());
    }

    /**
     * A subscribable event emitting every time the integrated app changes a language.
     * The new language name is emitted with each change.
     *
     * This will be `undefined` if the language integration module hasn't been imported by the app.
     * 
     * @readonly
     * @type {Observable<string> | undefined}
     */
    public get changed(): Observable<string> | undefined
    {
        return this.config?.changed;
    }

    /**
     * The default language used by the integrated app.
     *
     * This will be `undefined` in the following cases:
     * 1. The language integration module hasn't been imported by the app.
     * 2. The default language hasn't resolved yet.
     * 
     * @readonly
     * @type {string | undefined}
     */
    public get default(): string | undefined
    {
        return this.defaultLang;
    }

    /**
     * The languages supported by the integrated app.
     *
     * This will be `undefined` in the following cases:
     * 1. The language integration module hasn't been imported by the app.
     * 2. Supported languages haven't resolved yet.
     *
     * @readonly
     * @type {string[] | undefined}
     */
    public get supported(): string[] | undefined
    {
        return this.supportedLangs;
    }

    /**
     * The current language used by the integrated app.
     *
     * This will be `undefined` in the following cases:
     * 1. The language integration module hasn't been imported by the app.
     * 2. The `changed` event hasn't emitted yet.
     *
     * @readonly
     * @type {string | undefined}
     */
    public get current(): string | undefined
    {
        return this.currentLang;
    }
    
    /**
     * Indicated whether the language integration module has been imported into the app.
     * If this is `false`, this service will serve no purpose.
     *
     * @readonly
     * @type {boolean}
     */
    public get enabled()
    {
        return !!(this.config);
    }

    /**
     * A resolvable async object which emits once when the intgrated language services are ready for operation.
     * 
     * This will complete immediately if the the language integration module hasn't been imported, or a `ready` observable hasn't
     * been provided when importing the module.
     *
     * @readonly
     * @type {Observable<void>}
     */
    public get ready(): Observable<void>
    {
        return this.$ready;
    }

    /**
     * Retrieves the list of alternative languages to the specified language supported by the integrated app.
     *
     * @param {string} lang The language for which to get the alternative languages.
     * @returns {string[]} An array of alternative languages supported by the integrated app.
     * @throws If the language integration module hasn't been imported into the app.
     */
    public alternateLanguagesFor(lang: string): string[]
    {
        this.ensureEnabled();
        
        return this.supported!.filter(supportedLocale => supportedLocale !== lang);
    }
    
    /**
     * Translates a value (typically a translation id) into the current language used by the integrated app.
     *
     * @param {string} value The value to translate (typically a translation id).
     * @param {Record<string, unknown>} [params] (Optional) Any params needed for translating the value.
     * @returns {string} The translation of the specified value and params in the current language used by the integrated app.
     * @throws If the language integration module hasn't been imported into the app.
     */
    public translate(value: string, params?: Record<string, unknown>): string
    {
        this.ensureEnabled();

        return this.config!.translate(value, params);
    }

    /**
     * Dives deep into an object or an array and replaces the indicated properties in-place with their translation. 
     *
     * The `paths` argument is an array of paths representing deep properties which should be translated.
     * For example:
     * 
     * ```typescript
     * // If we have a user object, we can translate its city and role properties
     * {
     *     id: 15,
     *     addresses: [
     *         { city: 'Tel Aviv', ... },
     *         { city: 'Rishon LeTzion' }
     *     ],
     *     system: {
     *         role: 'Admin'
     *     }
     * }
     * 
     * // Our paths would be:
     * `addresses[0].city`
     * `addresses[1].city`
     * `system.role`
     * ```
     * 
     * @param {Record<string, unknown>} data The object which holds the translatable properties. Can be a deeply nested object.
     * @param {string[]} paths The paths of the translatable properties to translate and replace.
     * @throws If the language integration module hasn't been imported into the app.
     */
    public translateProperties(data: Record<string, unknown>, paths: string[]): void
    {
        this.ensureEnabled();
        
        paths.forEach(path =>
        {
            const valueAccessor = access<string>(data, path);
            const value = valueAccessor.get();

            if (typeof value !== 'string') return;

            valueAccessor.set(this.translate(value));
        });
    }
    
    /**
     * Ensures that the language integration module has been imported and a configuration object has been provided.
     * 
     * @throws {Error} The language integration module hasn't been imported by the app.
     */
    public ensureEnabled(): this is { config: LanguageIntegrationConfig }
    {
        if (this.enabled) return true;

        throw new Error(`
            Language integration hasn't been enabled.
            Did you import the language integration module in your app module using 'LanguageIntegrationModule.forRoot()'?
        `);
    }
}
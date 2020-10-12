import { get, set                     } from 'lodash-es';
import { EMPTY, from, Observable, of  } from 'rxjs';
import { Inject, Injectable, Optional } from '@angular/core';
import { Destroyable                  } from '@bespunky/angular-zen/core';

import { LanguageIntegrationConfig, LanguageIntegration } from '../config/language-integration-config';
import { UrlLocalization, UrlLocalizationConfig         } from '../url-localization/url-localization-config';

@Injectable({ providedIn: 'root' })
export class LanguageIntegrationService extends Destroyable
{
    private $ready     : Observable<void>;
    private defaultLang: string;
    private supported  : string[];
    private current    : string;

    constructor(
        @Optional() @Inject(LanguageIntegration) private config?               : LanguageIntegrationConfig,
        @Optional() @Inject(UrlLocalization)     private urlLocalizetionConfig?: UrlLocalizationConfig,
    )
    {
        super();

        this.initReadyObservable();

        if (config) this.initMultiLanguageSupport();
    }
    
    private initReadyObservable(): void
    {
        const ready = this.config?.ready;

        this.$ready = ready ? from(ready) : EMPTY;
    }

    private initMultiLanguageSupport(): void
    {
        this.subscribe(this.config.changed, lang => this.current = lang);

        // User's responsability to provide a completing observables.
        this.loadDefaultLanguage   ().subscribe(defaultLang => this.defaultLang = defaultLang);
        this.loadSupportedLanguages().subscribe(languages   => this.supported   = languages);
    }

    private loadDefaultLanguage(): Observable<string>
    {
        const defaultLang = this.config.default;
    
        return typeof defaultLang === 'string' ? of(defaultLang) : from(defaultLang);
    }

    private loadSupportedLanguages(): Observable<string[]>
    {
        const supported = this.config.supported;
        
        return Array.isArray(supported) ? of(supported) : from(supported); 
    }

    public getAlternateLanguages(lang: string): string[]
    {
        return this.supportedLanguages.filter(supportedLocale => supportedLocale !== lang);
    }

    public get changed(): Observable<string>
    {
        return this.config?.changed;
    }

    public get default(): string
    {
        return this.defaultLang;
    }

    public get supportedLanguages(): string[]
    {
        return this.supported;
    }

    public get currentLanguage(): string
    {
        return this.current;
    }
    
    public get enabled(): boolean
    {
        return !!(this.config);
    }

    public get ready(): Observable<void>
    {
        return this.$ready;
    }

    public get forceHttps(): boolean
    {
        return this.urlLocalizetionConfig?.forceHttps === true;
    }

    public translate(value: string, params?: any): string
    {
        this.ensureEnabled();

        return this.config.translate(value, params);
    }

    public translateProperties(data: any, paths: string[]): void
    {
        this.ensureEnabled();
        
        paths.forEach(path =>
        {
            const value = get(data, path);

            if (typeof value !== 'string') return;

            set(data, path, this.translate(value));
        });
    }
    
    /**
     * @throws {Error}
     */
    private ensureEnabled(): void
    {
        if (!this.enabled)
            throw new Error(`
                Multi language support hasn't been enabled. Probable causes:
                1. You haven't provided language integration config using the 'LanguageIntegration' token. You can use the 'provideLanguageIntegration()' function.
                2. Supported languages haven't been loaded yet.
            `);
    }
}
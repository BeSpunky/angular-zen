import { ClassProvider, FactoryProvider, InjectionToken, Type } from '@angular/core';

import { UrlLocalizer } from '../localizers/url-localizer';

/** Represents a factory function for building a `UrlLocalizer` using dependency injection. */
export type UrlLocalizerFactory = (...deps: any[]) => UrlLocalizer;

/** A strongly-typed factory provider for creating a `UrlLocalizer` using dependency injection. */
export interface UrlLocalizerFactoryProvider extends Omit<FactoryProvider, 'provide' | 'multi'>
{
    useFactory: UrlLocalizerFactory;
}

/** A strongly-typed class provider for instantiating a `UrlLocalizer`. */
export interface UrlLocalizerClassProvider extends Omit<ClassProvider, 'provide' | 'multi'>
{
    useClass: Type<UrlLocalizer>;
}

/** Represents the supported types of strategies for url localization. */
export type UrlLocalizationStrategy = number | string | UrlLocalizerFactoryProvider | UrlLocalizerClassProvider;

/** Represents the configutaration for url localization tools. */
export interface UrlLocalizationConfig
{
    /**
     * The strategy to use for url localization. Can be a:  
     * `Number`
     * - Positive numbers express the position of the language param from the start of the route.
     * - Negative numbers express the position of the language param from the end of the route.
     * - Zero is ignored and will cause no change to the url.
     * 
     * `String`
     * - The name of the query param specifying the current language.
     * 
     * `UrlLocalizerFactoryProvider`
     * - A provider for a factory for instantiating a `UrlLocalizer` object using dependency injection.
     * 
     * `UrlLocalizerClassProvider`
     * - A provider for an extending `UrlLocalizer` class.
     * @type {UrlLocalizationStrategy}
     */
    strategy   : UrlLocalizationStrategy;
    /**
     * (Optional) Indicates whether localization and delocalization of a url should always return an https prefix.
     * Default is `false`.
     * @type {boolean}
     */
    forceHttps?: boolean;
}

/**
 * An injection token for the provided url localization configuration.
 * `LanguageIntegrationModule.forRoot()` facilitates the injection of this token. No need to inject directly.
 */
export const UrlLocalization = new InjectionToken<UrlLocalizationConfig>('LanguageIntegration.Config');
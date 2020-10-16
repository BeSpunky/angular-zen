import { ClassProvider, FactoryProvider, InjectionToken, Type } from '@angular/core';
import { UrlLocalizer } from '../localizers/url-localizer';

export type UrlLocalizerFactory = (...deps: any[]) => UrlLocalizer;

// Strong-typed providers
export interface UrlLocalizerFactoryProvider extends Omit<FactoryProvider, 'provide' | 'multi'>
{
    useFactory: UrlLocalizerFactory;
}

export interface UrlLocalizerClassProvider extends Omit<ClassProvider, 'provide' | 'multi'>
{
    useClass: Type<UrlLocalizer>;
}

export type UrlLocalizationStrategy = number | string | UrlLocalizerFactoryProvider | UrlLocalizerClassProvider;

export interface UrlLocalizationConfig
{
    strategy   : UrlLocalizationStrategy;
    forceHttps?: boolean;
    hostUrl?   : string;
}

export const UrlLocalization = new InjectionToken<UrlLocalizationConfig>('LanguageIntegration.Config');
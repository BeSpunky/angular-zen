import { ClassProvider, FactoryProvider, InjectionToken, Provider, Type } from '@angular/core';
import { UrlLocalizer                   } from './localizers/url-localizer';
import { NoopUrlLocalizer               } from './localizers/noop-url-localizer';
import { RoutePositionUrlLocalizer      } from './localizers/route-position-url-localizer';
import { QueryParamsUrlLocalizer        } from './localizers/query-params-url-localizer';

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

export interface UrlLocalizationConfig
{
    strategy   : number | string | UrlLocalizerFactoryProvider | UrlLocalizerClassProvider;
    forceHttps?: boolean;
    hostUrl?   : string;
}

export const UrlLocalization = new InjectionToken<UrlLocalizationConfig>('LanguageIntegration.Config');
export const HostUrl         = new InjectionToken<string>('LanguageIntegration.Config.HostUrl');

export const DefaultUrlLocalizationConfig: UrlLocalizationConfig = {
    strategy  : { useClass: NoopUrlLocalizer },
    forceHttps: false
};

export function provideUrlLocalizer({ strategy }: UrlLocalizationConfig): Provider
{
    const strategies: { [type: string]: () => Partial<Provider> } = {
        // Use route position strategy for numbers
        number: () => ({ useFactory: () => new RoutePositionUrlLocalizer(strategy as number) }),
        // Use query params strategy for strings
        string: () => ({ useFactory: () => new QueryParamsUrlLocalizer(strategy as string) }),
        // Use UrlLocalizer classes as they are
        object: () => strategy
    };

    const provider: Provider = { provide: UrlLocalizer, useClass: undefined };

    return Object.assign(provider, strategies[typeof strategy]());
}

export function provideHostUrl(config?: UrlLocalizationConfig): Provider
{
    return { provide: HostUrl, useValue: config?.hostUrl };
}

export function provideUrlLocalizationConfig(config?: UrlLocalizationConfig): Provider[]
{
    config = Object.assign({}, DefaultUrlLocalizationConfig, config);

    return [
        { provide: UrlLocalization, useValue: config },
        provideUrlLocalizer(config),
        provideHostUrl(config)
    ];
}
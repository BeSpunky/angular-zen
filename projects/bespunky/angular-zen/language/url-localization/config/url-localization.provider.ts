import { Provider } from '@angular/core';
import { UrlLocalizer                           } from '../localizers/url-localizer';
import { RoutePositionUrlLocalizer              } from '../localizers/route-position-url-localizer';
import { QueryParamsUrlLocalizer                } from '../localizers/query-params-url-localizer';
import { NoopUrlLocalizer                       } from '../localizers/noop-url-localizer';
import { UrlLocalizationConfig, UrlLocalization } from './url-localization-config';

export const DefaultUrlLocalizationConfig: UrlLocalizationConfig = {
    strategy  : { useClass: NoopUrlLocalizer },
    forceHttps: false
};

export function provideUrlLocalizer({ strategy }: UrlLocalizationConfig): Provider
{
    const strategies: { [type: string]: () => Partial<Provider>; } = {
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

export function provideUrlLocalization(config?: UrlLocalizationConfig): Provider[]
{
    config = Object.assign({}, DefaultUrlLocalizationConfig, config);

    return [
        { provide: UrlLocalization, useValue: config },
        provideUrlLocalizer(config)
    ];
}

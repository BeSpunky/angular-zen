import { ClassProvider, FactoryProvider, Injectable, Type } from '@angular/core';

import { setupUrlLocalizerTest                                                                                                                                                                    } from '@bespunky/angular-zen/language/testing';
import { provideUrlLocalizer, UrlLocalizer, UrlLocalizationStrategy, UrlLocalizerClassProvider, UrlLocalizerFactoryProvider, RoutePositionUrlLocalizer, QueryParamsUrlLocalizer, NoopUrlLocalizer } from '@bespunky/angular-zen/language';
import { UrlReflectionService                                                                                                                                                                     } from '@bespunky/angular-zen/router-x';

describe('provideUrlLocalizer()', () =>
{
    function expectLocalizerProvider(type: 'class' | 'factory', strategy: UrlLocalizationStrategy, expected: Type<UrlLocalizer>)
    {
        const provider = provideUrlLocalizer({ strategy }) as (ClassProvider & FactoryProvider);

        expect(provider.provide).toBe(UrlLocalizer);
        
        if (type === 'class')
            expect(provider.useClass).toBe(expected);
        else
        {
            expect(provider.useFactory).toBeInstanceOf(Function);
            expect(provider.useFactory()).toBeInstanceOf(expected);
        }
    }

    it('should return a factory provider for route position when strategy is a positive number', () =>
    {
        expectLocalizerProvider('factory', 1, RoutePositionUrlLocalizer);
    });
    
    it('should return a factory provider for route position when strategy is a negative number', () =>
    {
        expectLocalizerProvider('factory', -1, RoutePositionUrlLocalizer);
    });

    it('should return a factory provider for query params when strategy is a string', () =>
    {
        expectLocalizerProvider('factory', 'lang', QueryParamsUrlLocalizer);
    });

    it('should return a factory provider for localizer factory providers', () =>
    {
        const localizerFactory: UrlLocalizerFactoryProvider = {
            useFactory: (urlReflection) => new MockLocalizer(urlReflection),
            deps      : [UrlReflectionService]
        };
      
        // Setup providers so the reflection service gets injected correctly
        setupUrlLocalizerTest(localizerFactory);
  
        expectLocalizerProvider('factory', localizerFactory, MockLocalizer);
    });

    it('should return a class provider for localizer class providers', () =>
    {
        const localizerClass: UrlLocalizerClassProvider = { useClass: MockLocalizer };
  
        expectLocalizerProvider('class', localizerClass, MockLocalizer);
    });

    it('should return a NoopUrlLocalizer class provider when strategy is undefined', () =>
    { 
        expectLocalizerProvider('class', undefined, NoopUrlLocalizer);
    });
});

@Injectable()
class MockLocalizer extends UrlLocalizer
{
    localize() { return 'null'; }

    delocalize() { return 'null'; }
}
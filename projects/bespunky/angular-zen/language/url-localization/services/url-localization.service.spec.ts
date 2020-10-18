import { TestBed } from '@angular/core/testing';
import { Router  } from '@angular/router';

import { setupUrlLocalizerTest                                                                                                       } from '@bespunky/angular-zen/language/testing';
import { UrlReflectionService, UrlLocalizer, UrlLocalizationService, UrlLocalization, UrlLocalizationStrategy, UrlLocalizationConfig } from '@bespunky/angular-zen/language';

describe('UrlLocalizationService', () =>
{
    let localizer      : UrlLocalizer;
    let urlLocalization: UrlLocalizationService;
    let urlReflection  : UrlReflectionService;
    let router         : Router;
    let localize       : jasmine.Spy;
    let delocalize     : jasmine.Spy;

    function setup(config: UrlLocalizationStrategy | UrlLocalizationConfig)
    {
        ({ localizer, urlLocalization, urlReflection, router } = setupUrlLocalizerTest(config));
  
        localize   = spyOn(localizer, 'localize'  ).and.callThrough();
        delocalize = spyOn(localizer, 'delocalize').and.callThrough();
    }

    describe('basically', () =>
    {
        beforeEach(() => setup('lang'));

        it('should use the localizer service to localize urls', () =>
        {
            const url = urlLocalization.localize('en');

            expect(localize).toHaveBeenCalledTimes(1);
            expect(localize).toHaveBeenCalledWith('en');
            expect(localize.calls.first().returnValue).toBe(url);
        });

        it('should use the localizer service to delocalize urls', () =>
        {
            const url = localizer.delocalize();

            expect(delocalize).toHaveBeenCalledTimes(1);
            expect(delocalize.calls.first().returnValue).toBe(url);
        });
    });

    describe('when `forceHttps` is provided as `true`', () =>
    {
        beforeEach(() => setup({ strategy: 'lang', forceHttps: true }));

        it('should replace http with https on localization', () =>
        {
            const url = urlLocalization.localize('en');

            expect(url.startsWith('https://')).toBeTrue();
        });

        it('should replace http with https on delocalization', () =>
        {
            const url = urlLocalization.delocalize();

            expect(url.startsWith('https://')).toBeTrue();
        });
    });
    
    describe('when `forceHttps` is provided as not `true`', () =>
    {
        beforeEach(() => setup('lang'));

        it('should not replace http with https on localization', () =>
        {
            const url = urlLocalization.localize('en');

            expect(url.startsWith('http://')).toBeTrue();
        });

        it('should not replace http with https on delocalization', () =>
        {
            const url = urlLocalization.delocalize();

            expect(url.startsWith('http://')).toBeTrue();
        });
    });
});
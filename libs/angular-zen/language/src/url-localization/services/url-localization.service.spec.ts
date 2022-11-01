import { setupUrlLocalizerTest                                                                } from '@bespunky/angular-zen/language/testing';
import { UrlLocalizer, UrlLocalizationService, UrlLocalizationStrategy, UrlLocalizationConfig } from '@bespunky/angular-zen/language';
import { UrlReflectionService                                                                 } from '@bespunky/angular-zen/router-x';

describe('UrlLocalizationService', () =>
{
    let localizer      : UrlLocalizer;
    let urlLocalization: UrlLocalizationService;
    let urlReflection  : UrlReflectionService;
    let localize       : jest.SpyInstance;
    let delocalize     : jest.SpyInstance;

    function setup(config: UrlLocalizationStrategy | UrlLocalizationConfig)
    {
        ({ localizer, urlLocalization, urlReflection } = setupUrlLocalizerTest(config));
  
        localize   = jest.spyOn(localizer, 'localize'  );
        delocalize = jest.spyOn(localizer, 'delocalize');
    }

    describe('basically', () =>
    {
        beforeEach(() => setup('lang'));

        it('should use the localizer service to localize urls', () =>
        {
            const url = urlLocalization.localize('en');

            expect(localize).toHaveBeenCalledTimes(1);
            expect(localize).toHaveBeenCalledWith('en');
            expect(localize.mock.results[0].value).toBe(url);
        });

        it('should use the localizer service to delocalize urls', () =>
        {
            const url = localizer.delocalize();

            expect(delocalize).toHaveBeenCalledTimes(1);
            expect(delocalize.mock.results[0].value).toBe(url);
        });

        it('generate localized urls for all specified languages using `generateLocalizedUrls()`', () =>
        {
            const langs = ['en', 'fr', 'he'];
            const urls  = urlLocalization.generateLocalizedUrls(langs);

            // Expect all languages to have an appropriate url
            langs.forEach((lang, index) => expect(urlReflection.queryStringOf(urls[index][lang])).toContain(`lang=${lang}`));
        });
    });

    describe('when `forceHttps` is provided as `true`', () =>
    {
        beforeEach(() => setup({ strategy: 'lang', forceHttps: true }));

        it('should replace http with https on localization', () =>
        {
            const url = urlLocalization.localize('en');

            expect(url.startsWith('https://')).toBe(true);
        });

        it('should replace http with https on delocalization', () =>
        {
            const url = urlLocalization.delocalize();

            expect(url.startsWith('https://')).toBe(true);
        });
    });
    
    describe('when `forceHttps` is provided as not `true`', () =>
    {
        beforeEach(() => setup('lang'));

        it('should not replace http with https on localization', () =>
        {
            const url = urlLocalization.localize('en');

            expect(url.startsWith('http://')).toBe(true);
        });

        it('should not replace http with https on delocalization', () =>
        {
            const url = urlLocalization.delocalize();

            expect(url.startsWith('http://')).toBe(true);
        });
    });
});
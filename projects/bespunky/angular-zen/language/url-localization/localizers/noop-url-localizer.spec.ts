import { setupUrlLocalizerTest              } from '@bespunky/angular-zen/language/testing';
import { UrlReflectionService, UrlLocalizer } from '@bespunky/angular-zen/language';

describe('NoopUrlLocalizer', () =>
{
    let localizer    : UrlLocalizer;
    let urlReflection: UrlReflectionService;

    beforeEach(() => ({ localizer, urlReflection } = setupUrlLocalizerTest(undefined)));

    it('should return the current unchanged complete url when localizing', () =>
    {
        const url = localizer.localize('en');
        
        expect(url).toBe(urlReflection.fullUrl);
    });

    it('should return the current unchanged complete url when delocalizing', () =>
    {
        const url   = localizer.delocalize();
        
        expect(url).toBe(urlReflection.fullUrl);
    });
});
import { Router } from '@angular/router';

import { setupUrlLocalizerTest } from '@bespunky/angular-zen/language/testing';
import { DeepRoutePath         } from '@bespunky/angular-zen/router-x/testing';
import { UrlLocalizer          } from '@bespunky/angular-zen/language';
import { UrlReflectionService  } from '@bespunky/angular-zen/router-x';

describe('NoopUrlLocalizer', () =>
{
    let localizer    : UrlLocalizer;
    let urlReflection: UrlReflectionService;
    let router       : Router;

    beforeEach(() => ({ localizer, urlReflection, router } = setupUrlLocalizerTest(undefined)));

    it('should return the current unchanged complete url when localizing', () =>
    {
        const url = localizer.localize('en');
        
        expect(url).toBe(urlReflection.fullUrl);
    });

    it('should return the current unchanged complete url when delocalizing', async () =>
    {
        await router.navigateByUrl(`/en/${DeepRoutePath}`);

        const url = localizer.delocalize();
        
        expect(url).toBe(urlReflection.fullUrl);
    });
});
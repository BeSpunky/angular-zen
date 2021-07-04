import { Router } from '@angular/router';

import { setupUrlLocalizerTest } from '@bespunky/angular-zen/language/testing';
import { UrlLocalizer          } from '@bespunky/angular-zen/language';

describe('QueryParamsUrlLocalizer', () =>
{
    let localizer: UrlLocalizer;
    let router   : Router;
    
    beforeEach(() => ({ localizer, router } = setupUrlLocalizerTest('lang')));

    const langQueryParamExp = /\?.*(lang=en)/;

    it('should add a language query param to the current url when localizing', () =>
    {
        const url = localizer.localize('en');
        
        expect(url).toMatch(langQueryParamExp);
    });

    it('should remove the language query param when delocalizing', async () =>
    {
        await router.navigate([''], { queryParams: { lang: 'en' } });

        const url = localizer.delocalize();
        
        expect(url).not.toMatch(langQueryParamExp);
    });
});
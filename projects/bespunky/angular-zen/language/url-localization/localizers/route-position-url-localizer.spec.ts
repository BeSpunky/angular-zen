import { Router } from '@angular/router';

import { DeepRoutePath, DeepRouteSegmentsNoRoot, setupUrlLocalizerTest } from '@bespunky/angular-zen/language/testing';
import { UrlLocalizer, UrlReflectionService                            } from '@bespunky/angular-zen/language';

interface SimpleTestConfig
{
    testedRoute : string;
    langPosition: number;
    call        : 'localize' | 'delocalize';
    language?   : string;
}

interface TestConfig extends SimpleTestConfig
{
    expectedLangSegmentAt?: number;
    expectedSegmentsDiff  : -1 | 0 | 1;
}

const firstSegmentIndex = 0;
const lastSegmentIndex  = DeepRouteSegmentsNoRoot.length;

describe('RoutePositionUrlLocalizer', () =>
{
    let localizer    : UrlLocalizer;
    let urlReflection: UrlReflectionService;
    let router       : Router;
    
    function setup({ testedRoute, langPosition }: SimpleTestConfig)
    {
        ({ localizer, urlReflection, router } = setupUrlLocalizerTest(langPosition));

        // Start test at the deeply nested route. This allows playing with the position a few times.
        return router.navigateByUrl(testedRoute);
    }

    function manipulateUrl({ testedRoute, call, language }: SimpleTestConfig)
    {
        const initialSegments  = urlReflection.routeSegmentsOf(testedRoute);
        const modifiedUrl      = call === 'localize' ? localizer.localize(language || 'en') : localizer.delocalize();
        const modifiedSegments = urlReflection.routeSegmentsOf(modifiedUrl);

        return { initialSegments, modifiedSegments }
    }

    function localizedDeepRoute(index: number, lang: string): string
    {
        const segments = [...DeepRouteSegmentsNoRoot];
    
        segments.splice(index, 0, lang);
    
        return segments.join('/');
    }

    async function testManipulation(config: TestConfig)
    {
        await setup(config);

        // Perform localization or delocalization
        const { initialSegments, modifiedSegments } = manipulateUrl(config);
        
        // Check that the new amount of segments fits with the expected one
        expect(modifiedSegments.length).toBe(initialSegments.length + config.expectedSegmentsDiff);

        return { initialSegments, modifiedSegments };
    }

    async function testLocalization(config: TestConfig)
    {
        // Perform localization or delocalization
        const { modifiedSegments } = await testManipulation(config);
     
        if (!config.expectedLangSegmentAt) return;

        // Create the expectation for the language segment's value
        let expectSegment = expect(modifiedSegments[config.expectedLangSegmentAt]);
        
        // When delocalizing, the language segment is expected NOT to be present
        if (config.call === 'delocalize') expectSegment = expectSegment.not;
        
        expectSegment.toEqual(config.language || 'en');
    }

    async function testNoChange(config: SimpleTestConfig)
    {
        return testManipulation({
            ...config,
            expectedSegmentsDiff: 0
        });
    }
    
    describe('localize', () =>
    {
        describe('for positive positions', () =>
        {
            it('should return an unchanged url if a language segment is already present', () => testLocalization({
                testedRoute          : `/en${DeepRoutePath}`,
                call                 : 'localize',
                langPosition         : 1,
                expectedLangSegmentAt: 0,
                expectedSegmentsDiff : 0
            }));
            
            it('should insert the language segment at the beginning of the url when position is 1', () => testLocalization({
                testedRoute          : DeepRoutePath,
                call                 : 'localize',
                langPosition         : 1,
                expectedLangSegmentAt: 0,
                expectedSegmentsDiff : 1
            }));
            
            it('should insert the language segment at the end of the url when position exceeds number of segments', () => testLocalization({
                testedRoute          : DeepRoutePath,
                call                 : 'localize',
                langPosition         : 20,
                expectedLangSegmentAt: lastSegmentIndex,
                expectedSegmentsDiff : 1
            }));

            it('should insert the language segment at the correct place when position is a within segments', () => testLocalization({
                testedRoute          : DeepRoutePath,
                call                 : 'localize',
                langPosition         : 3,
                expectedLangSegmentAt: 2,
                expectedSegmentsDiff : 1
            }));

            it('should replace the language segment if already exists', () => testLocalization({
                testedRoute          : localizedDeepRoute(2, 'en'),
                call                 : 'localize',
                langPosition         : 3,
                expectedLangSegmentAt: 2,
                expectedSegmentsDiff : 0,
                language             : 'fr'
            }));
        });
        
        describe('for negative positions', () =>
        {
            it('should return an unchanged url if a language segment is already present', () => testLocalization({
                testedRoute          : `${DeepRoutePath}/en`,
                call                 : 'localize',
                langPosition         : -1,
                expectedLangSegmentAt: lastSegmentIndex,
                expectedSegmentsDiff : 0
            }));
            
            it('should insert the language segment at the end of the url when position is -1', () => testLocalization({
                testedRoute          : DeepRoutePath,
                call                 : 'localize',
                langPosition         : -1,
                expectedLangSegmentAt: lastSegmentIndex,
                expectedSegmentsDiff : 1
            }));
            
            it('should insert the language segment at the beginning of the url when position exceeds number of segments', () => testLocalization({
                testedRoute          : DeepRoutePath,
                call                 : 'localize',
                langPosition         : -20,
                expectedLangSegmentAt: firstSegmentIndex,
                expectedSegmentsDiff : 1
            }));

            it('should insert the language segment at the correct place when position is a within segments', () => testLocalization({
                testedRoute          : DeepRoutePath,
                call                 : 'localize',
                langPosition         : -3,
                expectedLangSegmentAt: lastSegmentIndex - 2,
                expectedSegmentsDiff : 1
            }));

            it('should replace the language segment if already exists', () => testLocalization({
                testedRoute          : localizedDeepRoute(3, 'en'),
                call                 : 'localize',
                langPosition         : -3,
                expectedLangSegmentAt: lastSegmentIndex - 2,
                expectedSegmentsDiff : 0,
                language             : 'fr'
            }));
        });
        
        describe('for zero positions', () =>
        {
            it('should return an unchanged url when language is present', () => testNoChange({
                testedRoute : `/en${DeepRoutePath}`,
                call        : 'localize',
                langPosition: 0
            }));

            it('should return an unchanged url when language is not present', () => testNoChange({
                testedRoute : DeepRoutePath,
                call        : 'localize',
                langPosition: 0
            }));
        });
    });

    describe('delocalize', () =>
    {
        describe('for positive positions', () =>
        {
            it('should return an unchanged url if a language segment is not present', () => testLocalization({
                testedRoute          : DeepRoutePath,
                call                 : 'delocalize',
                langPosition         : 1,
                expectedLangSegmentAt: 0,
                expectedSegmentsDiff : 0
            }));
            
            it('should remove the language segment from the beginning of the url when position is 1', () => testLocalization({
                testedRoute          : `/en${DeepRoutePath}`,
                call                 : 'delocalize',
                langPosition         : 1,
                expectedLangSegmentAt: 0,
                expectedSegmentsDiff : -1
            }));
            
            it('should remove the language segment at the end of the url when position exceeds number of segments', () => testLocalization({
                testedRoute          : `${DeepRoutePath}/en`,
                call                 : 'delocalize',
                langPosition         : 20,
                expectedLangSegmentAt: lastSegmentIndex,
                expectedSegmentsDiff : -1
            }));

            it('should remove the language segment from the correct place when position is a within segments', () => testLocalization({
                testedRoute          : localizedDeepRoute(2, 'en'),
                call                 : 'delocalize',
                langPosition         : 3,
                expectedLangSegmentAt: 2,
                expectedSegmentsDiff : -1
            }));
        });
        
        describe('for negative positions', () =>
        {
            it('should return an unchanged url if a language segment is not present', () => testLocalization({
                testedRoute          : DeepRoutePath,
                call                 : 'delocalize',
                langPosition         : -1,
                expectedLangSegmentAt: lastSegmentIndex,
                expectedSegmentsDiff : 0
            }));
            
            it('should remove the language segment at the end of the url when position is -1', () => testLocalization({
                testedRoute          : `${DeepRoutePath}/en`,
                call                 : 'delocalize',
                langPosition         : -1,
                expectedLangSegmentAt: lastSegmentIndex,
                expectedSegmentsDiff : -1
            }));
            
            it('should remove the language segment at the beginning of the url when position exceeds number of segments', () => testLocalization({
                testedRoute          : `/en${DeepRoutePath}`,
                call                 : 'delocalize',
                langPosition         : -20,
                expectedLangSegmentAt: firstSegmentIndex,
                expectedSegmentsDiff : -1
            }));

            it('should remove the language segment at the correct place when position is a within segments', () => testLocalization({
                testedRoute          : localizedDeepRoute(3, 'en'),
                call                 : 'delocalize',
                langPosition         : -3,
                expectedLangSegmentAt: lastSegmentIndex - 3,
                expectedSegmentsDiff : -1
            }));
        });
        
        describe('for zero positions', () =>
        {
            it('should return an unchanged url when language is present', () => testNoChange({
                testedRoute : `/en${DeepRoutePath}`,
                call        : 'delocalize',
                langPosition: 0
            }));

            it('should return an unchanged url when language is not present', () => testNoChange({
                testedRoute : DeepRoutePath,
                call        : 'delocalize',
                langPosition: 0
            }));
        });    
    });
});
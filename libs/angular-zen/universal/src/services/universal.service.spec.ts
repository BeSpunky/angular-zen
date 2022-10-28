import { UniversalService } from './universal.service';
import { ɵPLATFORM_BROWSER_ID, ɵPLATFORM_SERVER_ID, ɵPLATFORM_WORKER_APP_ID, ɵPLATFORM_WORKER_UI_ID } from '@angular/common';

describe('UniversalService', () =>
{
    let service: UniversalService;

    function setup(platform: any = ɵPLATFORM_BROWSER_ID)
    {
        service = new UniversalService(platform);
    }

    describe('basically', () =>
    {
        beforeEach(() => setup());

        it('should be created', () => expect(service).toBeTruthy());

        it('should determine platform status', () =>
        {
            expect(typeof service.isPlatformBrowser   === 'boolean').toBeTruthy();
            expect(typeof service.isPlatformServer    === 'boolean').toBeTruthy();
            expect(typeof service.isPlatformWorkerApp === 'boolean').toBeTruthy();
            expect(typeof service.isPlatformWorkerUi  === 'boolean').toBeTruthy();
        });
    });

    describe('platform ifs', () =>
    {
        const platforms = [ɵPLATFORM_BROWSER_ID, ɵPLATFORM_SERVER_ID, ɵPLATFORM_WORKER_APP_ID, ɵPLATFORM_WORKER_UI_ID];
        const nonPlatforms = platforms.reduce((tests, platform) => ({ ...tests, [platform]: platforms.filter(p => p !== platform) }), {} as { [platform: string]: string[] });

        const testedPlaforms: { name: keyof UniversalService, platform: string }[] = [
            { name: 'onBrowser', platform: ɵPLATFORM_BROWSER_ID },
            { name: 'onServer', platform: ɵPLATFORM_SERVER_ID },
            { name: 'onWorkerApp', platform: ɵPLATFORM_WORKER_APP_ID },
            { name: 'onWorkerUi', platform: ɵPLATFORM_WORKER_UI_ID }
        ];

        const testedNonPlaforms: { name: keyof UniversalService, platform: string }[] = [
            { name: 'onNonBrowser', platform: ɵPLATFORM_BROWSER_ID },
            { name: 'onNonServer', platform: ɵPLATFORM_SERVER_ID },
            { name: 'onNonWorkerApp', platform: ɵPLATFORM_WORKER_APP_ID },
            { name: 'onNonWorkerUi', platform: ɵPLATFORM_WORKER_UI_ID }
        ];

        function testPlatformExecution(methodName: keyof UniversalService, platform: string, expectedSuccess: boolean)
        {
            setup(platform);
            expect(service[methodName](() => 'success')).toBe(expectedSuccess ? 'success' : undefined);
        }

        function producePlatformExecutionSpec(methodName: keyof UniversalService, platform: string)
        {
            describe(`calling ${methodName}`, () =>
            {
                it(`should execute on ${platform} platforms`, () =>
                {
                    testPlatformExecution(methodName, platform, true);
                });
                
                it(`should NOT execute on other platforms`, () =>
                {
                    nonPlatforms[platform].forEach(nonPlatform => testPlatformExecution(methodName, nonPlatform, false));
                });
            });
        }

        function produceNonPlatformExecutionSpec(methodName: keyof UniversalService, platform: string)
        {
            describe(`calling ${methodName}`, () =>
            {
                it(`should NOT execute on ${platform} platforms`, () =>
                {
                    testPlatformExecution(methodName, platform, false);
                });
                
                it(`should execute on non-${platform} platforms`, () =>
                {
                    nonPlatforms[platform].forEach(nonPlatform => testPlatformExecution(methodName, nonPlatform, true));
                });
            });
        }

        testedPlaforms   .forEach(({ name, platform }) => producePlatformExecutionSpec   (name, platform));
        testedNonPlaforms.forEach(({ name, platform }) => produceNonPlatformExecutionSpec(name, platform));
    });
});

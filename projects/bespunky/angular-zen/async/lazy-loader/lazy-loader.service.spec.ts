import { TestBed } from '@angular/core/testing';

import { setupDocumentRefMock, MockScriptElement, MockLinkElement } from '@bespunky/angular-zen/core/testing';
import { LazyLoaderService } from './lazy-loader.service';

describe('LazyLoaderService', () =>
{
    const testUrl = 'testurl';

    // The loader service to test
    let service: LazyLoaderService;
    // Mock for the DocumentRef.nativeDocument object
    let mockDocument: any;

    beforeEach(() =>
    {
        ({ mockDocument } = setupDocumentRefMock());

        service = TestBed.inject(LazyLoaderService);
    });

    it('should be created', () => expect(service).toBeTruthy());

    describe('Calling `loadScript()`', () =>
    {
        it('should create a `<script>` tag inside `<head>`', (done: DoneFn) =>
        {
            service.loadScript(testUrl).subscribe(lazyScript =>
            {
                const script: MockScriptElement = lazyScript.element.nativeElement;

                expect(script.src).toEqual(testUrl);
                expect(script.type).toEqual('text/javascript');
                expect(script.async).toBeTruthy();
                expect(script.defer).toBeTruthy();

                done();
            });
        });

        it('should skip creation if script was previously loaded', () =>
        {
            service.loadScript(testUrl).subscribe();
            service.loadScript(testUrl).subscribe();

            expect(mockDocument.createElement).toHaveBeenCalledTimes(1);
        });

        it('should return same script object if script was previously loaded', (done: DoneFn) =>
        {
            service.loadScript(testUrl).subscribe(lazyScript =>
            {
                service.loadScript(testUrl).subscribe(lazyScript2 =>
                {
                    expect(lazyScript2).toBe(lazyScript);
                    done();
                });
            });
        });

        describe('Providing options', () =>
        {
            it('should change `<script>` tag attributes', (done: DoneFn) =>
            {
                service.loadScript(testUrl, { async: false, defer: false }).subscribe(lazyScript =>
                {
                    const script: MockScriptElement = lazyScript.element.nativeElement;

                    expect(script.async).toBeFalsy();
                    expect(script.defer).toBeFalsy();

                    done();
                });
            });

            it('should allow overriding `isLoaded()` implementation', () =>
            {
                service.loadScript(testUrl, { alreadyLoaded: () => false }).subscribe();
                service.loadScript(testUrl, { alreadyLoaded: () => false }).subscribe();

                expect(mockDocument.createElement).toHaveBeenCalledTimes(2);

                service.loadScript(testUrl, { alreadyLoaded: () => true }).subscribe();

                expect(mockDocument.createElement).toHaveBeenCalledTimes(2);
            });

            it('should allow forcing script load if script was previously loaded', () =>
            {
                service.loadScript(testUrl).subscribe();
                service.loadScript(testUrl, { force: true }).subscribe();

                expect(mockDocument.createElement).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('Calling `loadStyle()`', () =>
    {
        it('should create a `<link>` tag inside `<head>`', (done: DoneFn) =>
        {
            service.loadStyle(testUrl).subscribe(lazyStyle =>
            {
                const link: MockLinkElement = lazyStyle.element.nativeElement;

                expect(link.href).toEqual(testUrl);
                expect(link.rel).toEqual('stylesheet');
                expect(link.type).toEqual('text/css');

                done();
            });
        });

        it('should skip creation if link was previously loaded', () =>
        {
            service.loadStyle(testUrl).subscribe();
            service.loadStyle(testUrl).subscribe();

            expect(mockDocument.createElement).toHaveBeenCalledTimes(1);
        });

        it('should return same link object if link was previously loaded', (done: DoneFn) =>
        {
            service.loadStyle(testUrl).subscribe(lazyLink =>
            {
                service.loadStyle(testUrl).subscribe(lazyLink2 =>
                {
                    expect(lazyLink2).toBe(lazyLink);
                    done();
                });
            });
        });

        describe('Providing options', () =>
        {
            it('should allow overriding `isLoaded()` implementation', () =>
            {
                service.loadStyle(testUrl, { alreadyLoaded: () => false }).subscribe();
                service.loadStyle(testUrl, { alreadyLoaded: () => false }).subscribe();

                expect(mockDocument.createElement).toHaveBeenCalledTimes(2);

                service.loadStyle(testUrl, { alreadyLoaded: () => true }).subscribe();

                expect(mockDocument.createElement).toHaveBeenCalledTimes(2);
            });

            it('should allow forcing script load if script was previously loaded', () =>
            {
                service.loadStyle(testUrl).subscribe();
                service.loadStyle(testUrl, { force: true }).subscribe();

                expect(mockDocument.createElement).toHaveBeenCalledTimes(2);
            });
        });
    });
});

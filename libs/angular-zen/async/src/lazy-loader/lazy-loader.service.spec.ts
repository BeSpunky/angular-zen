import { TestBed } from '@angular/core/testing';

import { setupDocumentRefMock, MockScriptElement, MockLinkElement, MockHeadElement } from '@bespunky/angular-zen/core/testing';
import { HeadService                                                               } from '@bespunky/angular-zen/core';
import { LazyLoaderService                                                         } from './lazy-loader.service';

describe('LazyLoaderService', () =>
{
    const testUrl = 'testurl';

    // The loader service to test
    let service        : LazyLoaderService;
    // Mock for the DocumentRef.nativeDocument object
    let mockDocument   : any;
    let mockHeadElement: MockHeadElement
    let head           : HeadService;

    beforeEach(() =>
    {
        ({ mockDocument, mockHeadElement } = setupDocumentRefMock());

        jest.spyOn(mockHeadElement, 'querySelectorAll').mockImplementation(selector =>
        {
            const tagEnd = selector.indexOf('[');
            const tag    = selector.substring(0, tagEnd >= 0 ? tagEnd : undefined);
    
            const attributes = mockHeadElement.extractAttributesFromSelector(selector);
            
            return mockHeadElement.children.filter(child => child.tagName === tag && attributes.every((attr: { name: string | number; value: any; }) => child[attr.name] == attr.value));
        });

        service = TestBed.inject(LazyLoaderService);
        head    = TestBed.inject(HeadService);
    });

    it('should be created', () => expect(service).toBeTruthy());

    describe('Calling `isScriptPresent()`', () =>
    {
        it('should return `true` if a matching script element is present in <head>', () =>
        {
            head.addScriptElement('text/javascript', testUrl);

            expect(service.isScriptPresent(testUrl)).toBeTruthy();
        });

        it('should return `false` if no matching script element is present in <head>', () =>
        {
            head.addScriptElement('text/javascript', testUrl + 'something');

            expect(service.isScriptPresent(testUrl)).toBeFalsy();
        });
    });

    describe('Calling `isStylePresent()`', () =>
    {
        it('should return `true` if a matching style element is present in <head>', () =>
        {
            head.addLinkElement('stylesheet', { href: testUrl });

            expect(service.isStylePresent(testUrl)).toBeTruthy();
        });

        it('should return `false` if no matching style element is present in <head>', () =>
        {
            head.addLinkElement('stylesheet', { href: testUrl + 'something' });

            expect(service.isStylePresent(testUrl)).toBeFalsy();
        });
    });

    describe('Calling `loadScript()`', () =>
    {
        it('should create a `<script>` tag inside `<head>`', done =>
        {
            service.loadScript(testUrl).subscribe(lazyScript =>
            {
                const script: MockScriptElement = lazyScript?.element?.nativeElement;

                expect(script?.src).toEqual(testUrl);
                expect(script?.type).toEqual('text/javascript');
                expect(script?.async).toBeTruthy();
                expect(script?.defer).toBeTruthy();

                done();
            });
        });

        it('should skip creation if script was previously loaded', () =>
        {
            service.loadScript(testUrl).subscribe();
            service.loadScript(testUrl).subscribe();

            expect(mockDocument.createElement).toHaveBeenCalledTimes(1);
        });

        it('should skip creation if script is already present in <head>', () =>
        {
            head.addScriptElement('text/javascript', testUrl);
            
            service.loadScript(testUrl).subscribe();

            expect(mockDocument.createElement).toHaveBeenCalledTimes(1);
        });

        it('should return an observable streaming `undefined` if script was already present in <head>', done =>
        {
            head.addScriptElement('text/javascript', testUrl);

            service.loadScript(testUrl).subscribe(lazyScript =>
            {
                expect(lazyScript).toBeUndefined();
                done();
            });
        });

        it('should return same script object if script was previously loaded', done =>
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
            it('should change `<script>` tag attributes', done =>
            {
                service.loadScript(testUrl, { async: false, defer: false }).subscribe(lazyScript =>
                {
                    const script: MockScriptElement = lazyScript?.element?.nativeElement;

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
        it('should create a `<link>` tag inside `<head>`', done =>
        {
            service.loadStyle(testUrl).subscribe(lazyStyle =>
            {
                const link: MockLinkElement = lazyStyle?.element?.nativeElement;

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

        it('should skip creation if style is already present in <head>', () =>
        {
            head.addLinkElement('stylesheet', { href: testUrl });
            
            service.loadStyle(testUrl).subscribe();

            expect(mockDocument.createElement).toHaveBeenCalledTimes(1);
        });

        it('should return an observable streaming `undefined` if style was already present in <head>', done =>
        {
            head.addLinkElement('stylesheet', { href: testUrl });
            
            service.loadStyle(testUrl).subscribe(lazyLink =>
            {
                expect(lazyLink).toBeUndefined();
                done();
            });
        });

        it('should return same link object if link was previously loaded', done =>
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

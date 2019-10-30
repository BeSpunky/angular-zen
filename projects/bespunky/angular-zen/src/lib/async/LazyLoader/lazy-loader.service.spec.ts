import { TestBed } from '@angular/core/testing';

import { LazyLoaderService } from './lazy-loader.service';
import { DocumentRef } from '../../core/DocumentRef/document-ref.service';
import { StyleLoadOptions, LinkRel } from './style-load-options';

// A stub for the created script tag
class ScriptTagStub
{
    async: boolean;
    defer: boolean;
    src: string;
    type: string;

    onload: () => void;
    onerror: () => void;
}

class LinkTagStub
{
    href: string;
    type: string;
    rel: string;
    crossOrigin: string;
    hreflang: string;
    media: string;
    relList = {
        add: (...tokens: string[]) => this.rel = tokens.join(',')
    };
    
    onload: () => void;
    onerror: () => void;
}

describe('LazyLoaderService', () =>
{
    const testUrl = 'testurl';

    // The loader service to test
    let service: LazyLoaderService;
    // Mock for DocumentRef that is injected to LazyScriptLoaderService
    let documentRefMock: any;
    // Mock for the DocumentRef.nativeDocument object
    let documentMock: any;
    // Mock for the document.head object
    let headMock: any;
    // Stub for the instance of the script tag that will be created when calling loadScript()
    let scriptTagStub: ScriptTagStub;
    // Stub for the instance of the link tag that will be created when calling loadStyle()
    let linkTagStub: LinkTagStub;

    /* Mocks the following hierarchy:
     * DocumentRef {
     *   nativeDocument: {
     *     head: { appendChild: () => void },
     *     createElement: () => scriptTagStub | linkTagStub
     *   }
     * }
     */
    function setupDocumentRefMock()
    {
        // Create the stubs for the elements to be created
        scriptTagStub = new ScriptTagStub();
        linkTagStub = new LinkTagStub();

        // Create the head object allowing to spy on its appendChild() function
        headMock = jasmine.createSpyObj('head', ['appendChild']);
        // When head.appendChile() is called, simulate async call to onload()
        headMock.appendChild.and.callFake(createdTag => setTimeout(createdTag.onload, 0));

        // Create the document object allowing to spy on its createElement() function
        documentMock = jasmine.createSpyObj('document', ['createElement']);
        // When the element should be created, substitute it for the stub
        documentMock.createElement.and.callFake((tagName: string) =>
        {
            console.log('create element called.');
            return tagName === 'script' ? scriptTagStub : linkTagStub;
        });

        // Create hierarchy
        documentRefMock = { nativeDocument: documentMock };
        documentMock.head = headMock;
    }

    beforeEach(() =>
    {
        setupDocumentRefMock();

        TestBed.configureTestingModule({
            providers: [{ provide: DocumentRef, useValue: documentRefMock }]
        });

        service = TestBed.get(LazyLoaderService);
    });

    it('should be created', () => expect(service).toBeTruthy());

    describe('Calling `loadScript()`', () =>
    {
        it('should create a `<script>` tag inside `<head>`', () =>
        {
            service.loadScript(testUrl).subscribe(lazyScript =>
            {
                const script: ScriptTagStub = lazyScript.element.nativeElement;

                expect(script.src).toEqual(testUrl);
                expect(script.type).toEqual('text/javascript');
                expect(script.async).toBeTruthy();
                expect(script.defer).toBeTruthy();
            });
        });

        it('should skip creation if script was previously loaded', () =>
        {
            service.loadScript(testUrl).subscribe();
            service.loadScript(testUrl).subscribe();

            expect(documentMock.createElement).toHaveBeenCalledTimes(1);
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
                    const script: ScriptTagStub = lazyScript.element.nativeElement;

                    expect(script.async).toBeFalsy();
                    expect(script.defer).toBeFalsy();

                    done();
                });
            });

            it('should allow overriding `isLoaded()` implementation', () =>
            {
                service.loadScript(testUrl, { alreadyLoaded: () => false }).subscribe();
                service.loadScript(testUrl, { alreadyLoaded: () => false }).subscribe();

                expect(documentMock.createElement).toHaveBeenCalledTimes(2);

                service.loadScript(testUrl, { alreadyLoaded: () => true }).subscribe();

                expect(documentMock.createElement).toHaveBeenCalledTimes(2);
            });

            it('should allow forcing script load if script was previously loaded', () =>
            {
                service.loadScript(testUrl).subscribe();
                service.loadScript(testUrl, { force: true }).subscribe();

                expect(documentMock.createElement).toHaveBeenCalledTimes(2);
            });
        });
    });

    describe('Calling `loadStyle()`', () =>
    {
        it('should create a `<link>` tag inside `<head>`', () =>
        {
            service.loadStyle(testUrl).subscribe(lazyStyle =>
            {
                const link: LinkTagStub = lazyStyle.element.nativeElement;

                expect(link.href).toEqual(testUrl);
                expect(link.rel).toEqual('stylesheet');
                expect(link.type).toEqual('text/css');
            });
        });

        it('should skip creation if link was previously loaded', () =>
        {
            service.loadStyle(testUrl).subscribe();
            service.loadStyle(testUrl).subscribe();

            expect(documentMock.createElement).toHaveBeenCalledTimes(1);
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
            it('should change `<link>` tag attributes', (done: DoneFn) =>
            {
                const options: StyleLoadOptions = {
                    crossOrigin: 'use-credentials',
                    hreflang: 'fr_FR',
                    media: '(max-width: 100px)',
                    rel: ['next', 'help'],
                    type: 'type'
                };

                service.loadStyle(testUrl, options).subscribe(lazyLink =>
                {
                    const link: LinkTagStub = lazyLink.element.nativeElement;

                    expect(link.crossOrigin).toEqual(options.crossOrigin);
                    expect(link.hreflang).toEqual(options.hreflang);
                    expect(link.media).toEqual(options.media);
                    expect(link.rel).toEqual((options.rel as string[]).join(','));
                    expect(link.type).toEqual(options.type);

                    done();
                });
            });

            it('should allow overriding `isLoaded()` implementation', () =>
            {
                service.loadStyle(testUrl, { rel: 'stylesheet', alreadyLoaded: () => false }).subscribe();
                service.loadStyle(testUrl, { rel: 'stylesheet', alreadyLoaded: () => false }).subscribe();

                expect(documentMock.createElement).toHaveBeenCalledTimes(2);

                service.loadStyle(testUrl, { rel: 'stylesheet', alreadyLoaded: () => true }).subscribe();

                expect(documentMock.createElement).toHaveBeenCalledTimes(2);
            });

            it('should allow forcing script load if script was previously loaded', () =>
            {
                service.loadStyle(testUrl).subscribe();
                service.loadStyle(testUrl, { rel: 'stylesheet', force: true }).subscribe();

                expect(documentMock.createElement).toHaveBeenCalledTimes(2);
            });
        });
    });
});

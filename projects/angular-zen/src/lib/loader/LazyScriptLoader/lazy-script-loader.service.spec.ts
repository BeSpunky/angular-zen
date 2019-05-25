import { TestBed } from '@angular/core/testing';

import { LazyScriptLoaderService } from './lazy-script-loader.service';
import { DocumentRef } from '../../core/DocumentRef/document-ref.service';
import { LazyLoadedScript } from './lazy-loaded-script';

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

describe('LazyScriptLoaderService', () =>
{
    const testUrl = 'testurl';

    // The loader service to test
    let service: LazyScriptLoaderService;
    // Mock for DocumentRef that is injected to LazyScriptLoaderService
    let documentRefMock: any;
    // Mock for the DocumentRef.nativeDocument object
    let documentMock: any;
    // Mock for the document.head object
    let headMock: any;
    // Stub for the instance of the script tag that will be created when calling loadScript()
    let scriptTagStub: ScriptTagStub;

    /* Mocks the following hierarchy:
     * DocumentRef {
     *   nativeDocument: {
     *     head: { appendChild: () => void },
     *     createElement: () => scriptTagStub
     *   }
     * }
     */
    function setupDocumentRefMock()
    {
        // Create the stub for the script to be created
        scriptTagStub = new ScriptTagStub();

        // Create the head object allowing to spy on its appendChild() function
        headMock = jasmine.createSpyObj('head', ['appendChild']);
        // When head.appendChile() is called, simulate async call to onload()
        headMock.appendChild.and.callFake(createdScriptTag => setTimeout(createdScriptTag.onload, 0));

        // Create the document object allowing to spy on its createElement() function
        documentMock = jasmine.createSpyObj('document', ['createElement']);
        // When the script element should be created substitute it for the stub
        documentMock.createElement.and.returnValue(scriptTagStub);

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

        service = TestBed.get(LazyScriptLoaderService);
    });

    it('should be created', () => expect(service).toBeTruthy());

    describe('Calling `loadScript()`', () =>
    {
        it('should create a `<script>` tag inside `<head>`', () =>
        {
            service.loadScript(testUrl).subscribe(lazyScript =>
            {
                const script: ScriptTagStub = lazyScript.scriptElement.nativeElement;

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
                    const script: ScriptTagStub = lazyScript.scriptElement.nativeElement;

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
});

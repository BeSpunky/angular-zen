import { TestBed } from '@angular/core/testing';

import { setupDocumentRefMock, MockScriptTag, MockLinkTag } from '@bespunky/angular-zen/core/testing';
import { ScriptConfigurator                               } from '@bespunky/angular-zen/core';
import { HeadService                                      } from './head.service';
import { DOCUMENT                                         } from '../document-ref/document-ref.service';

describe('HeadService', () =>
{
    let service: HeadService;
    // Mock for the DocumentRef.nativeDocument object
    let mockDocument: any;
    // Mock for the document.head object
    let mockHead: any;
    // Stub for the instance of the script tag that will be created when calling loadScript()
    let mockScriptTag: MockScriptTag;
    // Stub for the instance of the link tag that will be created when calling loadStyle()
    let mockLinkTag: MockLinkTag;

    beforeEach(() =>
    {
        ({ mockScriptTag, mockLinkTag, mockHead, mockDocument } = setupDocumentRefMock());

        TestBed.configureTestingModule({
            providers: [{ provide: DOCUMENT, useValue: mockDocument }]
        });
        
        service = TestBed.inject(HeadService);
    });

    it('should be created', () => expect(service).toBeTruthy());

    describe('calling `addScriptElement()`', () =>
    {
        function testScript(config?: ScriptConfigurator, expectMore?: () => void)
        {
            const type = 'application/javascript';
            const src = 'https://dummy.url';
            
            service.addScriptElement(type, src, config);

            expect(mockHead.appendChild).toHaveBeenCalledWith(mockScriptTag);
            expect(mockScriptTag.type).toBe(type);
            expect(mockScriptTag.src).toBe(src);

            if (expectMore) expectMore();
        }

        it('should create a <script> element in <head> when calling `addScriptElement()` with no config', () => testScript());

        it('should create a <script> element in <head> when calling `addScriptElement()` a config object', () => testScript({ async: true, onload: () => void 0 }, () =>
        {
            expect(mockScriptTag.async).toBeTruthy();
            expect(mockScriptTag.onload instanceof Function).toBeTruthy();
        }));

        it('should create a <script> element in <head> when calling `addScriptElement()` a config function', () => testScript(script => script.onerror = () => void 0, () =>
        {
            expect(mockScriptTag.onerror instanceof Function).toBeTruthy();
        }));
    });
});

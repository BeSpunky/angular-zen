import { TestBed } from '@angular/core/testing';

import { setupDocumentRefMock, MockElement, MockScriptElement, MockLinkElement, MockHeadElement } from '@bespunky/angular-zen/core/testing';
import { ScriptConfigurator, LinkConfigurator, ElementConfigurator, HeadService } from '@bespunky/angular-zen/core';

describe('HeadService', () =>
{
    let service: HeadService;
    // Mock for the DocumentRef.nativeDocument object
    let mockDocument: any;
    // Mock for the document.head object
    let mockHeadElement: MockHeadElement;
    // Stub for the instance of the script element that will be created when calling addScriptElement()
    let mockScriptElement: MockScriptElement;
    // Stub for the instance of the link element that will be created when calling addLinkElement()
    let mockLinkElement: MockLinkElement;
    // Stub for the instance of the link element that will be created when calling addElement()
    let mockDivElement: MockElement;

    beforeEach(() =>
    {
        ({ mockDivElement, mockScriptElement, mockLinkElement, mockHeadElement, mockDocument } = setupDocumentRefMock());
        
        spyOn(mockHeadElement as any, 'querySelectorAll').and.callFake((selector: string) =>
        {
            const tagEnd = selector.indexOf('[');
            const tag    = selector.substring(0, tagEnd >= 0 ? tagEnd : undefined);
    
            const attributes = mockHeadElement.extractAttributesFromSelector(selector);
            
            return mockHeadElement.children.filter(child => child.tagName === tag && attributes.every(attr => child[attr.name] == attr.value));
        });

        service = TestBed.inject(HeadService);
    });

    it('should be created', () => expect(service).toBeTruthy());

    describe('calling `addScriptElement()`', () =>
    {
        function testScript(config?: ScriptConfigurator, expectMore?: () => void)
        {
            const type = 'application/javascript';
            const src  = 'https://dummy.url';
            
            service.addScriptElement(type, src, config);

            expect(mockHeadElement.children[0]).toBe(mockScriptElement);
            expect(mockScriptElement.type).toBe(type);
            expect(mockScriptElement.src).toBe(src);

            if (expectMore) expectMore();
        }

        it('should create a <script> element in <head> when calling `addScriptElement()` with no config', () => testScript());

        it('should create a <script> element in <head> when calling `addScriptElement()` a config object', () => testScript({ async: true, onload: () => void 0 }, () =>
        {
            expect(mockScriptElement.async).toBeTruthy();
            expect(mockScriptElement.onload instanceof Function).toBeTruthy();
        }));

        it('should create a <script> element in <head> when calling `addScriptElement()` a config function', () => testScript(script => script.onerror = () => void 0, () =>
        {
            expect(mockScriptElement.onerror instanceof Function).toBeTruthy();
        }));
    });

    describe('calling `addLinkElement()`', () =>
    {
        function testLink(config?: LinkConfigurator, expectMore?: () => void)
        {
            const rel = 'canonical';
            
            service.addLinkElement(rel, config);

            expect(mockHeadElement.children[0]).toBe(mockLinkElement);
            expect(mockLinkElement.rel).toBe(rel);

            if (expectMore) expectMore();
        }

        it('should create a <link> element in <head> when calling `addLinkElement()` with no config', () => testLink());

        it('should create a <link> element in <head> when calling `addLinkElement()` a config object', () => testLink({ as: 'happy', onload: () => void 0 }, () =>
        {
            expect(mockLinkElement.as).toBe('happy');
            expect(mockLinkElement.onload instanceof Function).toBeTruthy();
        }));

        it('should create a <link> element in <head> when calling `addLinkElement()` a config function', () => testLink(script => script.onerror = () => void 0, () =>
        {
            expect(mockLinkElement.onerror instanceof Function).toBeTruthy();
        }));
    });

    describe('calling `addElement()`', () =>
    {
        function testElement(config?: ElementConfigurator<HTMLElement>, expectMore?: () => void)
        {
            service.addElement('div', config);

            expect(mockHeadElement.children[0]).toBe(mockDivElement);

            if (expectMore) expectMore();
        }

        it('should create an element in <head> when calling `addElement()` with no config', () => testElement());

        it('should create an element in <head> when calling `addElement()` a config object', () => testElement({ dir: 'rtl', className: 'container' }, () =>
        {
            expect(mockDivElement.dir).toBe('rtl');
            expect(mockDivElement.className).toBe('container');
        }));

        it('should create an element in <head> when calling `addElement()` a config function', () => testElement(element => element.dir = 'rtl', () => expect(mockDivElement.dir).toBe('rtl')));
    });

    describe('calling `removeElement()`', () =>
    {
        it('should ')
    });

    describe('calling `findElements()`', () =>
    {
        function testFind(tag: string, attributes: any, expectedResultCount: number)
        {
            let results = service.findElements(tag, attributes);

            expect(results.length).toBe(expectedResultCount);
        }

        it('should return the elements in <head> matching the given name element and attributes', () =>
        {
            service.addElement('td', { colspan: 2 });
            service.addElement('td', { colspan: 2, rowspan: 2 });
            service.addElement('td', { colspan: 4, rowspan: 4 });

            testFind('script', {}, 0);
            
            testFind('td', {                        }, 3);
            testFind('td', { colspan: 2             }, 2);
            testFind('td', { colspan: 2, rowspan: 2 }, 1);
        });
    })
});

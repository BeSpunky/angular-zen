import { TestBed } from '@angular/core/testing';

import { setupDocumentRefMock, MockHeadElement                                  } from '@bespunky/angular-zen/core/testing';
import { ScriptConfigurator, LinkConfigurator, ElementConfigurator, HeadService } from '@bespunky/angular-zen/core';

describe('HeadService', () =>
{
    let service: HeadService;
    // Mock for the document.head object
    let mockHeadElement: MockHeadElement;

    beforeEach(() =>
    {
        ({ mockHeadElement } = setupDocumentRefMock());
        
        spyOn(mockHeadElement as any, 'querySelectorAll').and.callFake((selector: string) =>
        {
            const tagEnd = selector.indexOf('[');
            const tag    = selector.substring(0, tagEnd >= 0 ? tagEnd : undefined);

            const attributes = mockHeadElement.extractAttributesFromSelector(selector);

            return mockHeadElement.children.filter(child => child.tagName === tag && attributes.every(attr =>
            {
                return attr.value === '**' ? child[attr.name] : child[attr.name] == attr.value;
            }));
        });

        service = TestBed.inject(HeadService);
    });

    it('should be created', () => expect(service).toBeTruthy());

    describe('calling `addScriptElement()`', () =>
    {
        function testScript(config?: ScriptConfigurator, expectMore?: (script: HTMLScriptElement) => void)
        {
            const type = 'application/javascript';
            const src  = 'https://dummy.url';
            
            const script = service.addScriptElement(type, src, config).nativeElement;

            expect(mockHeadElement.children[0]).toBe(script);
            expect(script.type).toBe(type);
            expect(script.src).toBe(src);

            if (expectMore) expectMore(script);
        }

        it('should create a <script> element in <head> when calling `addScriptElement()` with no config', () => testScript());

        it('should create a <script> element in <head> when calling `addScriptElement()` a config object', () => testScript({ async: true, onload: () => void 0 }, (script) =>
        {
            expect(script.async).toBeTruthy();
            expect(script.onload instanceof Function).toBeTruthy();
        }));

        it('should create a <script> element in <head> when calling `addScriptElement()` a config function', () => testScript(script => script.onerror = () => void 0, (script) =>
        {
            expect(script.onerror instanceof Function).toBeTruthy();
        }));
    });

    describe('calling `addLinkElement()`', () =>
    {
        function testLink(config?: LinkConfigurator, expectMore?: (link: HTMLLinkElement) => void)
        {
            const rel = 'canonical';
            
            const link = service.addLinkElement(rel, config).nativeElement;

            expect(mockHeadElement.children[0]).toBe(link);
            expect(link.rel).toBe(rel);

            if (expectMore) expectMore(link);
        }

        it('should create a <link> element in <head> when calling `addLinkElement()` with no config', () => testLink());

        it('should create a <link> element in <head> when calling `addLinkElement()` a config object', () => testLink({ as: 'happy', onload: () => void 0 }, (link) =>
        {
            expect(link.as).toBe('happy');
            expect(link.onload instanceof Function).toBeTruthy();
        }));

        it('should create a <link> element in <head> when calling `addLinkElement()` a config function', () => testLink(script => script.onerror = () => void 0, (link) =>
        {
            expect(link.onerror instanceof Function).toBeTruthy();
        }));
    });

    describe('calling `addElement()`', () =>
    {
        function testElement(config?: ElementConfigurator<HTMLElement>, expectMore?: (div: HTMLElement) => void)
        {
            const div = service.addElement('div', config).nativeElement;

            expect(mockHeadElement.children[0]).toBe(div);

            if (expectMore) expectMore(div);
        }

        it('should create an element in <head> when calling `addElement()` with no config', () => testElement());

        it('should create an element in <head> when calling `addElement()` a config object', () => testElement({ dir: 'rtl', className: 'container' }, (div) =>
        {
            expect(div.dir).toBe('rtl');
            expect(div.className).toBe('container');
        }));

        it('should create an element in <head> when calling `addElement()` a config function', () => testElement(element => element.dir = 'rtl', (div) => expect(div.dir).toBe('rtl')));
    });

    function addLinkElementsWithDifferentAttributesForLookup()
    {
        service.addLinkElement('alternate', { hreflang: 'en' });
        service.addLinkElement('alternate', { hreflang: 'es' });
        service.addLinkElement('alternate', { hreflang: 'he', href: 'https://dummy.url' });
        
        service.addLinkElement('canonical', { href: 'https://dummy.canonical.url' });
    }

    describe('calling `removeElement()`', () =>
    {
        beforeEach(addLinkElementsWithDifferentAttributesForLookup);

        it('should remove the first matching element from <head>', () =>
        {
            const shouldBeRemoved = mockHeadElement.children[3];

            expect(mockHeadElement.children.length).toBe(4);

            expect(service.removeElement('link', { rel: 'canonical' })).toBe(shouldBeRemoved);
            expect(mockHeadElement.children.length).toBe(3);
        });

        it('should not throw if no matching element was found in <head>', () => expect(() => service.removeElement('meta', {})).not.toThrow());
        it('should return null if no matching element was found in <head>', () => expect(service.removeElement('meta', {})).toBeNull());
    });

    describe('calling `removeElements()`', () =>
    {
        beforeEach(addLinkElementsWithDifferentAttributesForLookup);

        it('should remove all matching element from <head>', () =>
        {
            const shouldBeRemoved = mockHeadElement.children.slice(0, 3);

            expect(mockHeadElement.children.length).toBe(4);

            expect(service.removeElements('link', { hreflang: '**' })).toEqual(shouldBeRemoved);
            expect(mockHeadElement.children.length).toBe(1);
        });

        it('should match elements using ALL attributes', () =>
        {
            const shouldBeRemoved = [mockHeadElement.children[2]];

            expect(mockHeadElement.children.length).toBe(4);

            expect(service.removeElements('link', { hreflang: '**', href: '**' })).toEqual(shouldBeRemoved);
            expect(mockHeadElement.children.length).toBe(3);
        });

        it('should not throw if no matching element was found in <head>', () => expect(() => service.removeElements('meta', {})).not.toThrow());
        it('should return an empty array if no matching element was found in <head>', () => expect(service.removeElements('meta', {})).toEqual([]));
    });

    describe('calling `removeLinkElement()`', () =>
    {
        beforeEach(addLinkElementsWithDifferentAttributesForLookup);

        it('should remove the first matching element from <head>', () =>
        {
            const shouldBeRemoved = mockHeadElement.children[0];

            expect(mockHeadElement.children.length).toBe(4);

            expect(service.removeLinkElement('alternate', { })).toBe(shouldBeRemoved);
            expect(mockHeadElement.children.length).toBe(3);
        });

        it('should not throw if no matching element was found in <head>', () => expect(() => service.removeLinkElement('author', {})).not.toThrow());
        it('should return null if no matching element was found in <head>', () => expect(service.removeLinkElement('author', {})).toBeNull());
    });

    describe('calling `removeLinkElements()`', () =>
    {
        beforeEach(addLinkElementsWithDifferentAttributesForLookup);

        it('should remove all matching element from <head>', () =>
        {
            const shouldBeRemoved = mockHeadElement.children.slice(0, 3);

            expect(mockHeadElement.children.length).toBe(4);

            expect(service.removeLinkElements('alternate', { hreflang: '**' })).toEqual(shouldBeRemoved);
            expect(mockHeadElement.children.length).toBe(1);
        });

        it('should not throw if no matching element was found in <head>', () => expect(() => service.removeLinkElements('author', {})).not.toThrow());
        it('should return an empty array if no matching element was found in <head>', () => expect(service.removeLinkElements('author', {})).toEqual([]));
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
            addLinkElementsWithDifferentAttributesForLookup();

            testFind('script', {}, 0);
            
            testFind('link', {                        }, 4);
            testFind('link', { hreflang: 'en'         }, 1);
            testFind('link', { hreflang: 'en', href: 'https://dummy.url' }, 0);
            testFind('link', { hreflang: 'he', href: 'https://dummy.url' }, 1);
            
            testFind('link', { href: '**' }, 2);
        });
    });

    describe('calling `contains()`', () =>
    {
        beforeEach(addLinkElementsWithDifferentAttributesForLookup);

        it('should return `true` when a matching element is found', () => expect(service.contains('link', { hreflang: 'en' })).toBeTruthy());
        it('should return `false` when no matching element is found', () => expect(service.contains('td', { colspan: 10 })).toBeFalsy());
    });
});

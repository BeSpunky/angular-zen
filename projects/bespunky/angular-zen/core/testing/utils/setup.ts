import { TestBed } from '@angular/core/testing';

import { CoreModule, DOCUMENT } from '@bespunky/angular-zen/core';
import { MockScriptElement    } from '../mocks/script.mock';
import { MockLinkElement      } from '../mocks/link.mock';
import { MockHeadElement      } from '../mocks/head.mock';
import { MockElement          } from '../mocks/element.mock';

/**
 * Mocks the following hierarchy:
 * ```javascript
 *  DocumentRef {
 *    nativeDocument: {
 *      head: mockHeadElement,
 *      createElement: () => mockScriptElement | mockLinkElement | mockDivElement | MockElement(<tagName>)
 *    }
 *  }
 * ```
 * 
 * Used when testing head related services (e.g. HeadService, LazyLoaderService).
 * 
 * Any element created using `DocumentRef.nativeDocument.createElement()` will go through this mock.
 * The returned mocks allow expectations and state comparison as they are the objects returned
 * by the fake `createElement()` function.
 * 
 * If a script element was requested, the mockScriptElement object is returned.
 * If a link element was requested, the mockLinkElement object is returned.
 * If a div element was requested, the mockDivElement object is returned.
 * If any other tag name is requested, a new MockElement object is returned.
 * 
 * The returned mocks can be deconstructed like so:
 *
 * @example
 * let mockDivElement, mockScriptElement, ...;
 * 
 * ({ mockDivElement, mockScriptElement, mockLinkElement, mockHeadElement, mockDocument } = setupDocumentRefMock());
 */
export function setupDocumentRefMock()
{        
    // Create the stubs for the elements to be created
    let mockScriptElement = new MockScriptElement();
    let mockLinkElement   = new MockLinkElement();
    let mockDivElement    = new MockElement('div');
    let mockHeadElement   = new MockHeadElement();

    // Mock for the DocumentRef.nativeDocument object
    // Create the document object allowing to spy on its createElement() function
    let mockDocument = jasmine.createSpyObj('document', ['createElement']);
    // When an element should be created, substitute it for the appropriate mock
    mockDocument.createElement.and.callFake((tagName: string) =>
    {
        return tagName === 'script' ? mockScriptElement :
               tagName === 'link'   ? mockLinkElement   :
               tagName === 'div'    ? mockDivElement    :
               new MockElement(tagName);
    });

    // Create hierarchy
    mockDocument.head = mockHeadElement;

    TestBed.configureTestingModule({
        imports  : [CoreModule],
        providers: [
            { provide: DOCUMENT, useValue: mockDocument }
        ]
    });

    return { mockScriptElement, mockLinkElement, mockDivElement, mockHeadElement, mockDocument };
}
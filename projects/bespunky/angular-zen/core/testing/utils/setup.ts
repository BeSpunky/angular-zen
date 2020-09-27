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
 *      head: MockHeadElement,
 *      createElement: () => MockScriptElement | MockLinkElement | MockElement(<tagName>)
 *    }
 *  }
 * ```
 * 
 * Used when testing head related services (e.g. HeadService, LazyLoaderService).
 * 
 * Any element created using `DocumentRef.nativeDocument.createElement()` will go through this mock.
 * If a script element was requested, a MockScriptElement object is returned.
 * If a link element was requested, the MockLinkElement object is returned.
 * If any other tag name is requested, a new MockElement object is returned.
 * 
 * The returned mocks can be deconstructed like so:
 *
 * @example
 * let mockHeadElement: MockHeadElement;
 * let mockDocument   : any;
 * 
 * ({ mockHeadElement, mockDocument } = setupDocumentRefMock());
 */
export function setupDocumentRefMock()
{        
    // Mock for the DocumentRef.nativeDocument object
    // Create the document object allowing to spy on its createElement() function
    let mockDocument = jasmine.createSpyObj('document', ['createElement']);
    // When an element should be created, substitute it for the appropriate mock
    mockDocument.createElement.and.callFake((tagName: string) =>
    {
        return tagName === 'script' ? new MockScriptElement() :
               tagName === 'link'   ? new MockLinkElement()  :
               new MockElement(tagName);
    });

    // Create a stub for the head element
    let mockHeadElement = new MockHeadElement();
    // Create hierarchy
    mockDocument.head = mockHeadElement;

    TestBed.configureTestingModule({
        imports  : [CoreModule],
        providers: [
            { provide: DOCUMENT, useValue: mockDocument }
        ]
    });

    return { mockHeadElement, mockDocument };
}
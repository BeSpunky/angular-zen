import { TestBed } from '@angular/core/testing';
import { NgZone  } from '@angular/core';
import { Router  } from '@angular/router';

import { CoreModule, DOCUMENT } from '@bespunky/angular-zen/core';
import { MockScriptElement    } from '../mocks/script.mock';
import { MockLinkElement      } from '../mocks/link.mock';
import { MockHeadElement      } from '../mocks/head.mock';
import { MockElement          } from '../mocks/element.mock';

/**
 * Configures a testing module provided with a ready-to-use mock for [`DOCUMENT`](/miscellaneous/variables.html#DOCUMENT).
 * 
 * Any element created using `DocumentRef.nativeDocument.createElement()` will go through this mock.
 * If a script element was requested, a `MockScriptElement` object is returned.
 * If a link element was requested, the `MockLinkElement` object is returned.
 * If any other tag name is requested, a new `MockElement` object is returned.
 * 
 * Used when testing head related services (e.g. HeadService, LazyLoaderService).
 * 
 * Internally, this plants the following structure in [`DocumentRef`](/additional-documentation/coremodule/documentref.html):
 * 
 * `DocumentRef.nativeDocument.head -> MockHeadElement`  
 * 
 * `DocumentRef.nativeDocument.createElement -> () => MockScriptElement | MockLinkElement | MockElement(<tagName>)`
 * 
 * The returned mocks can be deconstructed like so:
 * @example
 * let mockHeadElement: MockHeadElement;
 * let mockDocument   : any; 
 * ({ mockHeadElement, mockDocument } = setupDocumentRefMock()); // mockDocument is also a jasmine.Spy
 */
export function setupDocumentRefMock(): { mockHeadElement: MockHeadElement, mockDocument: any }
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

/**
 * Wraps the `navigate` and `navigateByUrl` methods of the router with a call to `NgZone.run()`.
 * Fixes the warning when using the router in unit tests.
 *
 * @export
 * @param {Router} router The router instance.
 */
export function forceRoutingInsideAngularZone(router: Router): void
{
    const zone          = TestBed.inject(NgZone);
    
    const navigate      = router.navigate.bind(router);
    const navigateByUrl = router.navigateByUrl.bind(router);

    // Fix for angular's warning of running navigation outside angular's zone
    spyOn(router, 'navigate'     ).and.callFake((...args: any[]) => zone.run(() => navigate     (...args)));
    spyOn(router, 'navigateByUrl').and.callFake((...args: any[]) => zone.run(() => navigateByUrl(...args)));
}
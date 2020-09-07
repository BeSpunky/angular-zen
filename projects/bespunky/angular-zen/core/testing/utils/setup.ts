import { MockScriptTag } from '../mocks/script.mock';
import { MockLinkTag   } from '../mocks/link.mock';

/* Mocks the following hierarchy:
*  DocumentRef {
*    nativeDocument: {
*      head: { appendChild: () => void },
*      createElement: () => mockScriptTag | mockLinkTag
*    }
*  }
*/
export function setupDocumentRefMock()
{        
    // Create the stubs for the elements to be created
    let mockScriptTag = new MockScriptTag();
    let mockLinkTag   = new MockLinkTag();

    // Mock for the document.head object
    // Create the head object allowing to spy on its appendChild() function
    let mockHead = jasmine.createSpyObj('head', ['appendChild']);
    // When head.appendChile() is called, simulate async call to onload()
    mockHead.appendChild.and.callFake(createdTag => setTimeout(createdTag.onload, 0));

    // Mock for the DocumentRef.nativeDocument object
    // Create the document object allowing to spy on its createElement() function
    let mockDocument = jasmine.createSpyObj('document', ['createElement']);
    // When the element should be created, substitute it for the stub
    mockDocument.createElement.and.callFake((tagName: string) => tagName === 'script' ? mockScriptTag : mockLinkTag);

    // Create hierarchy
    mockDocument.head = mockHead;

    return { mockScriptTag, mockLinkTag, mockHead, mockDocument };
}
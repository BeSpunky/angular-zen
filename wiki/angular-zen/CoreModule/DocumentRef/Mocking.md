In certain cases, the default implementation provided by the service might not answer the needs of your code.
One such case is testing.

When testing, we sometimes need to simulate the internal workings of the native `document` object.
Assuming you injected `DocumentRef` into your component or service:

```typescript
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, DocumentRef, DOCUMENT } from '@bespunky/angular-zen/core';

import { DocumentRefDemoComponent } from './document-ref-demo.component';

describe('DocumentRefDemoComponent', () =>
{
    let component   : DocumentRefDemoComponent;
    let fixture     : ComponentFixture<DocumentRefDemoComponent>;
    let element     : DebugElement;
    let documentMock: any;
    let documentRef : DocumentRef;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [DocumentRefDemoComponent],
            // 1. Import CoreModule
            imports: [CoreModule],
            providers: [
                // 2. Provide the TestBed module with a new value for DOCUMENT
                { provide: DOCUMENT, useValue: { title: 'demo' } }
            ]
        }).compileComponents();
        
        ...

        // 3. Get a hold of the DocumentRef implementation and our mock document object
        documentRef  = TestBed.inject(DocumentRef);
        documentMock = TestBed.inject(DOCUMENT);
    }));

    it('should ...', () => {
        expect(documentRef.nativeDocument).toBe(documentMock);
        expect(documentRef.nativeDocument.title).toBe('demo');
    });
});
```

> **Notice** that `DOCUMENT` is imported from `@bespunky/angular-zen/core` and not from `@angular/common`.
> Providing a value for angular's token directly might break your app/spec as angular relies on the token internally.

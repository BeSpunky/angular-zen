import { TestBed } from '@angular/core/testing';

import { DocumentRef } from './document-ref.service';

describe('DocumentRef', () =>
{
    let service: DocumentRef;

    beforeEach(() =>
    {
        TestBed.configureTestingModule({});

        service = TestBed.get(DocumentRef);
    });

    it('should be created', () =>
    {
        expect(service).toBeTruthy();
    });

    it('should allow access to the `document` object', () =>
    {
        expect(typeof service.nativeDocument).toBe('object');
    });
});

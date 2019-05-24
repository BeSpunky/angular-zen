import { TestBed } from '@angular/core/testing';

import { DocumentRef } from './document-ref.service';

describe('DocumentRef', () =>
{
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () =>
    {
        const service: DocumentRef = TestBed.get(DocumentRef);
        expect(service).toBeTruthy();
    });
});

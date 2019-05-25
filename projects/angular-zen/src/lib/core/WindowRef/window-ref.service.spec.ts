import { TestBed } from '@angular/core/testing';

import { WindowRef } from './window-ref.service';

describe('WindowRef', () =>
{
    let service: WindowRef;

    beforeEach(() =>
    {
        TestBed.configureTestingModule({});

        service = TestBed.get(WindowRef);
    });

    it('should be created', () =>
    {
        expect(service).toBeTruthy();
    });

    it('should allow access to the `window` object', () =>
    {
        expect(typeof service.nativeWindow).toBe('object');
    });
});

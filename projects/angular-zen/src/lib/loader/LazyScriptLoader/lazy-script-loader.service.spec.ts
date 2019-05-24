import { TestBed } from '@angular/core/testing';

import { LazyScriptLoaderService } from './lazy-script-loader.service';

describe('LazyScriptLoaderService', () =>
{
    beforeEach(() => TestBed.configureTestingModule({}));

    it('should be created', () =>
    {
        const service: LazyScriptLoaderService = TestBed.get(LazyScriptLoaderService);
        expect(service).toBeTruthy();
    });
});

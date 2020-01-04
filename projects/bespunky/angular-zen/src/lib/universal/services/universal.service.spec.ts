import { TestBed } from '@angular/core/testing';

import { UniversalService } from './universal.service';
import { UniversalModule } from '../universal.module';

describe('UniversalService', () =>
{
    let service: UniversalService;

    beforeEach(() =>
    {
        TestBed.configureTestingModule({
            imports: [UniversalModule.forRoot()]
        });
        
        service = TestBed.get(UniversalService);
    });

    it('should be created', () =>
    {
        expect(service).toBeTruthy();
    });

    it('should determine platform status', () =>
    {
        expect(typeof service.isPlatformBrowser   === 'boolean').toBeTruthy();
        expect(typeof service.isPlatformServer    === 'boolean').toBeTruthy();
        expect(typeof service.isPlatformWorkerApp === 'boolean').toBeTruthy();
        expect(typeof service.isPlatformWorkerUi  === 'boolean').toBeTruthy();
    });
});

import { Subject             } from 'rxjs';
import { TestBed             } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Injectable          } from '@angular/core';

import { LanguageConfig            } from '@bespunky/angular-zen/language/testing';
import { LanguageIntegrationModule } from '../language-integration.module';
import { LocalizedRouteAware       } from './localized-route-aware.service';

@Injectable({ providedIn: 'root' })
class LocalizedRouteAwareMock extends LocalizedRouteAware
{
    public override onLanguageServicesReady(): void { void 0; }
     
    public override onLanguageChanged(lang: string): void { void 0; }
}

describe('LocalizedRouteAware (abstract)', () =>
{
    let service        : LocalizedRouteAwareMock;
    let languageChanged: Subject<string>;
    
    // These methods are called in the construction, so spy befure construction time
    const languageServicesReadySpy = jest.spyOn(LocalizedRouteAwareMock.prototype, 'onLanguageServicesReady');
    const languageChangedSpy       = jest.spyOn(LocalizedRouteAwareMock.prototype, 'onLanguageChanged'      );

    function setup(enableIntegration = true)
    {
        const imports = [RouterTestingModule.withRoutes([])];

        if (enableIntegration)
        {
            languageChanged = new Subject();

            const integrationConfig = Object.assign({}, LanguageConfig, { changed: languageChanged });

            imports.push(LanguageIntegrationModule.forRoot({ useFactory: () => integrationConfig }));
        }

        TestBed.configureTestingModule({ imports });
        
        // These spies are global, so reset their call records before each test
        languageServicesReadySpy.mockReset();
        languageChangedSpy      .mockReset();

        service = TestBed.inject(LocalizedRouteAwareMock);
    }

    describe('basically', () =>
    {
        beforeEach(() => setup());

        it('should be created', () => expect(service).toBeDefined());

        it('should notify `onLanguageChanged()` of language changes', () =>
        {
            languageChanged.next('he');
    
            expect(languageChangedSpy).toHaveBeenCalledTimes(1);
            expect(languageChangedSpy).toHaveBeenCalledWith('he');
        });

        it('should notify `onLanguageServicesReady()` of language services initialization', () =>
        { 
            expect(languageServicesReadySpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('when language integration is disabled', () =>
    {
        beforeEach(() => setup(false));

        it('should be created without failure', () => expect(service).toBeDefined());
    });
});

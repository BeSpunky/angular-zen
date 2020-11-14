import { Subject             } from 'rxjs';
import { TestBed             } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Injectable          } from '@angular/core';

import { LanguageConfig            } from '@bespunky/angular-zen/language/testing';
import { LanguageIntegrationModule } from '../language-integration.module';
import { LocalizedRouteAware       } from './localized-route-aware.service';

describe('LocalizedRouteAware (abstract)', () =>
{
    let service                 : LocalizedRouteAwareMock;
    let languageChanged         : Subject<string>;
    let languageServicesReadySpy: jasmine.Spy;;
    let languageChangedSpy      : jasmine.Spy;;

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
        
        // These methods are called in the construction, so spy befure construction time
        languageServicesReadySpy = spyOn(LocalizedRouteAwareMock.prototype, 'onLanguageServicesReady').and.callThrough();
        languageChangedSpy       = spyOn(LocalizedRouteAwareMock.prototype, 'onLanguageChanged'      ).and.callThrough();

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

@Injectable({ providedIn: 'root' })
class LocalizedRouteAwareMock extends LocalizedRouteAware
{
    public onLanguageServicesReady(): void { }
    
    public onLanguageChanged(lang: string): void { }
}
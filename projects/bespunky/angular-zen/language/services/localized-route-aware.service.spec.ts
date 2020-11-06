import { Subject             } from 'rxjs';
import { TestBed             } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { Injectable          } from '@angular/core';

import { LanguageConfig             } from '@bespunky/angular-zen/language/testing';
// import { LanguageIntegrationModule  } from '../language-integration.module';
// import { LocalizedRouteAwareService } from './localized-route-aware.service';

import { LanguageIntegrationModule, LocalizedRouteAwareService } from '@bespunky/angular-zen/language';

describe('LocalizedRouteAwareService (abstract)', () =>
{
    let service        : LocalizedRouteAwareMock;
    let languageChanged: Subject<string>;

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

        service = TestBed.inject(LocalizedRouteAwareMock);
    }

    describe('basically', () =>
    {
        beforeEach(() => setup());

        it('should be created', () => expect(service).toBeDefined());

        it('should notify `onLanguageChanged()` of language changes', () =>
        {
            languageChanged.next('he');
 
            // languageChangeSpy is a workaround. See the languageChangedSpy member for more details.
            expect(service.languageChangedSpy).toHaveBeenCalledTimes(1);
            expect(service.languageChangedSpy).toHaveBeenCalledWith('he');
        });
    });

    describe('when language integration is disabled', () =>
    {
        beforeEach(() => setup(false));

        it('should be created without failure', () => expect(service).toBeDefined());
    });
});

@Injectable({ providedIn: 'root' })
class LocalizedRouteAwareMock extends LocalizedRouteAwareService
{
    /**
     * For some reason, calling spyOn(service, 'onLanguageChanged') results in an unusable spy.
     * Maybe related with the fact that onLanguageChanged is an override to the virtual one, hence
     * the spy is created on the base class??
     * The overriding method actually gets called by the spy is never triggered.
     * 
     * Came up with the languageChangedSpy member solution, which partially proves the theory.
     * Spy works now, no point in wasting time on further investigation.
     */
    public languageChangedSpy = jasmine.createSpy('languageChanged');

    public onLanguageChanged(lang: string)
    {
        this.languageChangedSpy(lang);
    }
}
import { EMPTY, Observable } from 'rxjs';
import { TestBed           } from '@angular/core/testing';

import { SupportedLanguages, DefaultLanguage, LanguageConfig } from '@bespunky/angular-zen/language/testing';
import { LanguageIntegrationModule                           } from '../language-integration.module';
import { LanguageIntegrationConfig                           } from '../config/language-integration-config';
import { LanguageIntegrationService                          } from './language-integration.service';

describe('LanguageIntegrationService', () =>
{
    let service: LanguageIntegrationService;

    function setupTest(LanguageConfig?: LanguageIntegrationConfig): void
    {
        const imports = [];

        if (LanguageConfig)
            imports.push(LanguageIntegrationModule.forRoot({ useFactory: () => LanguageConfig }));

        TestBed.configureTestingModule({ imports });

        service = TestBed.inject(LanguageIntegrationService);
    }

    describe('basically', () =>
    {
        beforeEach(() => setupTest());

        it('should be created', () => expect(service).toBeDefined());
    });

    describe('when enabled', () =>
    {
        beforeEach(() => setupTest(LanguageConfig));

        it('should expose language changes through an observable', () =>
        {
            expect(service.changed).toBeInstanceOf(Observable);
            expect(service.changed).toBe(LanguageConfig.changed);
        });

        it('should expose the default language', () =>
        {
            expect(service.default).toBe(DefaultLanguage);
        });

        it('should expose the supported languages', () =>
        {
            expect(service.supported).toBe(SupportedLanguages);
        });

        it('should expose the current language', () =>
        {
            expect(service.current).toBe(DefaultLanguage);
        });

        it('should be flagged as enabled', () =>
        {
            expect(service.enabled).toBeTruthy();
        });

        it('should expose readyness through an observable', () =>
        {
            expect(service.ready).toBeInstanceOf(Observable);
        });

        it('should get the alternate languages for a language', () =>
        {
            expect(service.alternateLanguagesFor(DefaultLanguage)).toEqual(['fr', 'he']);
        });        

        it('should return all supported languages when asking for alternates of a non-supported language', () =>
        {
            expect(service.alternateLanguagesFor('not-supported-language')).toEqual(SupportedLanguages);
        });
        
        it('should translate a given value', () =>
        {
            expect(service.translate('text')).toEqual(LanguageConfig.translate('text'));
        });

        it('should deep translate and assign all translatable properties in an object', () =>
        {
            const text = 'title';
            const deepText = 'deepTitle';

            const dummy = {
                text,
                value: 123,
                data: {
                    deepText,
                    deepValue: 321
                }
            };

            service.translateProperties(dummy, ['text', 'data.deepText']);

            expect(dummy.text         ).toEqual(LanguageConfig.translate(text));
            expect(dummy.data.deepText).toEqual(LanguageConfig.translate(deepText));

            // Make sure nothing else was touched.
            expect(dummy.value         ).toEqual(123);
            expect(dummy.data.deepValue).toEqual(321);
        });

        it('should not throw', () => expect(() => service.ensureEnabled()).not.toThrow());
    });

    describe('when disabled', () =>
    {
        const integrationDisabledError = /Language integration hasn't been enabled/;

        beforeEach(() => setupTest());

        it('should return undefined for changes', () =>
        {
            expect(service.changed).toBeUndefined();
        });

        it('should return undefined for default language', () =>
        {
            expect(service.default).toBeUndefined();
        });

        it('should return undefined for supported languages', () =>
        {
            expect(service.supported).toBeUndefined();
        });
        
        it('should return undefined for current language', () =>
        {
            expect(service.current).toBeUndefined();
        });

        it('should be flagged as disabled', () =>
        {
            expect(service.enabled).toBeFalsy();
        });

        it('should return an empty observable for readyness', () =>
        {
            expect(service.ready).toBe(EMPTY);
        });

        it('should throw when getting the alternate languages for a language', () =>
        {
            expect(() => service.alternateLanguagesFor(DefaultLanguage)).toThrowError(integrationDisabledError);
        });

        it('should throw when translating a given value', () =>
        {
            expect(() => service.translate('text')).toThrowError(integrationDisabledError);
        });

        it('should throw when deep translating properties in an object', () =>
        {
            expect(() => service.translateProperties({ value: 'text' }, ['value'])).toThrowError(integrationDisabledError);
        });
   
        it('should throw explaining that language integration is not enabled', () => expect(() => service.ensureEnabled()).toThrowError(integrationDisabledError));
    });
});
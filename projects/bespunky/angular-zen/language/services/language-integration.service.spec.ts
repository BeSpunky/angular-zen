// import { TestBed } from '@angular/core/testing';
// import { LanguageIntegrationConfig, LanguageIntegrationModule, LanguageIntegrationService, UrlLocalizationConfig } from '@bespunky/angular-zen/language'
// import { of } from 'rxjs';

// describe('LanguageIntegrationService', () =>
// {
//     let service: LanguageIntegrationService;

//     function createIntegrationConfig(): LanguageIntegrationConfig
//     {
//         return {
//             changed  : of('en'),
//             default  : 'en',
//             supported: ['en', 'fr', 'he'],
//             translate: value => `TRANSLATED: ${value}`,
//             ready    : of (true)
//         };
//     }

//     function setupTest(configFactory: LanguageIntegrationConfigFactory, urlLocalization?: UrlLocalizationConfig): void
//     {
//         TestBed.configureTestingModule({
//             imports: [
//                 LanguageIntegrationModule.forRoot({ useFactory: configFactory }, urlLocalization)
//             ]
//         });

//         service = TestBed.inject(LanguageIntegrationService);
//     }

//     describe('')
//     beforeEach(async () =>
//     {
//         sup
//     });
// });
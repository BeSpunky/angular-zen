Once your app implements its language solution, you can provide language services to supporting libraries by importing `LanguageIntegrationModule`.

The module should be imported only once, in your app root, using the `forRoot()` method.

## Providing integration services
Use the `useFactory` and `deps` properties to provide your language services. The following example shows how to configure a provider for [`ngx-translate`](https://github.com/ngx-translate/core):

```typescript
import { BrowserModule                                        } from '@angular/platform-browser';
import { NgModule                                             } from '@angular/core';
import { TranslateService                                     } from '@ngx-translate/core';
import { LanguageIntegrationModule, LanguageIntegrationConfig } from '@bespunky/angular-zen/language';

import { AppComponent } from './app.component';

export const SupportedLocales = ['en', 'es', 'he'];

export function createLanguageIntegrationConfig(translate: TranslateService): LanguageIntegrationConfig
{
    return {
        // Provide the languages supported by the app (can also be a factory for an async task)
        supported: SupportedLocales,
        // Provide the default language used by the app (can also be a factory for an async task)
        default  : SupportedLocales[0],
        // Provide language change events and the new language as an argument
        changed  : translate.onLangChange.pipe(pluck('lang')),
        // Define how language services readiness is detected
        ready    : translate.onDefaultLangChange.pipe(take(1)),
        // Provide a live translation method
        translate: (value, params) => translate.instant(value, params)
    };
}

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        // Configure Provider
        LanguageIntegrationModule.forRoot({
            useFactory: createLanguageIntegrationConfig,
            deps      : [TranslateService]
        })
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

## Next Steps
[Implementing integration in a library](implementing-in-a-library.html)

[LocalizedRouteAware](localizedrouteaware-\(abstract\).html)

[UrlLocalizationService](urllocalizationservice.html)
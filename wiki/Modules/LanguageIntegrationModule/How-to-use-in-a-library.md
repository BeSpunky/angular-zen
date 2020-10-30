# [LanguageIntegrationService]

Your bridge to the language services of your user's app is the `LanguageIntegrationService`. Inject it into your services and components and your library will be able to get the supported languages, perform translations and more.

[[_TOC_]]

# Initialization
## `enabled` - Checking for integration presence
The service is always injectable. However it is up to the app developer using your library to import the language integration module.
If the module hasn't been imported, the service is considered to be 'disabled'.

> When the service is disabled methods might throw an error and properties might return `null` or `undefined` values.

To verify that the app has enabled language integration, use the `enabled` property.

## `ready` - Checking for integration readiness
Some apps might take some time to load their translation files or initialize their language services. To hook into the initialization process and know when the app's language services are ready, use the `ready` property.

> If the app didn't provide a ready promise or observable, the `ready` property will complete immediately.

## Example
The following example verifies that integration has been enabled and is ready, then and registers a handler for language changes.

```typescript
import { Injectable                 } from '@angular/core';
import { Destroyable                } from '@bespunky/angular-zen/core'; 
import { LanguageIntegrationService } from '@bespunky/angular-zen/language';

@Injectable({ providedIn: 'root' })
export class SomeLibraryService extends Destroyable
{
    constructor(private language: LanguageIntegrationService)
    {        
        if (this.language.enabled) this.initLanguageSupport();
    }

    private initLanguageSupport(): void
    {
        this.subscribe(this.language.ready  , this.onLanguageServicesInitialized.bind(this)); // Subscribe to the `ready` observable
        this.subscribe(this.language.changed, this.onLanguageChanged.bind(this));
    }

    protected onLanguageServicesInitialized(): void
    {
        // act on language services init...
    }

    protected onLanguageChanged(lang: string): void
    {
        // act on language change...
    }
}
```

# Retrieving Info

## `supported` - Retrieve the languages supported by the app
Returns an array of language codes as specified by the app.

## `current` - Retrieve the current language used by the app
Returns the language code of the language currently used by the app.

## `default` - Retrieve the default language used by the app
Returns the language code of the default language defined by the app.

## `alternateLanguagesFor()` - Retrieve the alternative languages to a language
Returns all the supported language codes except for the specified code.

> Example language codes might be `en`, `fr`, `en-US`, `es-CL`.

# Translation

## `translate()` - Translate values to the current language
When the service is ready, 

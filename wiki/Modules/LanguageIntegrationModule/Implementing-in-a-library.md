# [LanguageIntegrationService]

Your bridge to the language services of your user's app is the `LanguageIntegrationService`. Inject it into your services and components and your library will be able to get the supported languages, perform translations and more.

[[_TOC_]]

# Preparation
## `enabled` - Vefiying integration presence
The service is always injectable. However it is up to the **app** developer using your library to import the language integration module.
If the module hasn't been imported, the service is considered to be 'disabled'.

> When the service is disabled methods might throw an error and properties might return `null` or `undefined` values.

To verify that the app has enabled language integration, use the `enabled` property.

## `ready` - Vefiying  integration readiness
Some apps might take some time to load their translation files or initialize their language services. To hook into the initialization process and know when the app's language services are ready, use the `ready` property.

> If the app didn't provide a ready promise or observable, the `ready` property will complete immediately.

# Initialization
The following example verifies that integration has been enabled, then registers handlers for readiness and language changes.

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

# Forcing Integration
If your library requires the language integration tools and cannot provide a default behaviour without them, you can use the `ensureEnabled()` method to throw an explanatory error to the app's developer, telling him he must import the module. If integration has been enabled, the method will exit without an error.

To force integration, the constructor in the above example could be changed as follows:
```typescript
    constructor(private language: LanguageIntegrationService)
    {
        // Throw if language integration is disabled
        this.language.ensureEnabled();
        // Code still running. No error. Go ahead and initialize...
        this.initLanguageSupport();
    }
```

[See full API](LINK TO CODE)

# Next Steps
[Using integration in an app](/Modules/LanguageIntegrationModule/Implementing-in-a-library)

[Additional tools and configuration](/Modules/LanguageIntegrationModule/Additional-Language-Tools)
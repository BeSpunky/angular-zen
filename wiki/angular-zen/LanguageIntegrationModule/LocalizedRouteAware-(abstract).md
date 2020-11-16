Acting as a base class for services and components, this class facilitates bootstrapping for classes requiring both route and language awareness.

Extend this class, then override `onLanguageServicesReady()` and `onLanguageChanged()` methods as needed:

```typescript
import { Injectable          } from '@angular/core';
import { LocalizedRouteAware } from '@bespunky/angular-zen/language';

@Injectable({ providedIn: 'root' })
class LocalizedRouteAwareMock extends LocalizedRouteAware
{
    // Bonus: No constructor. Defaults to base constructor.

    protected onLanguageServicesReady(): void
    {
        // Act on services ready...
    }

    protected onLanguageChanged(lang: string) 
    {
        // Act on language change... (use `this.language` for language tools)
    }
}
```

> Consider marking `onLanguageServicesReady()` and `onLanguageChanged()` as `protected`, as they are usually intended for internal class use.

### Route-aware and destroyable
A `LocalizedRouteAware` is by definiton a [`RouteAware`](../routerxmodule/routeaware-\(abstract\).html), which is also [`Destroyable`](../coremodule/destroyable-\(abstract\).html).
Take advantage of the tools provided by the base class.

## See Also
[LanguageIntegrationModule](../languageintegrationmodule.html)

[Implementing integration in a library](implementing-in-a-library.html)

[Providing integration from an app](providing-from-an-app.html)
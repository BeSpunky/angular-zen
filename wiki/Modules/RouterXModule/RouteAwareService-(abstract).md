Acting as a base class, this service creates a layer between the router and your app to help facilitate route related tasks.

# Destroyable
The service is [`Destroyable`](/Modules/CoreModule/Destroyable-\(abstract\)). You can take advantage of that when working with subscriptions.

# Events Dispatcher
Recognize this line...?
```typescript
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(this.onNavigationStart.bind(this));
```

Well, say your goodbyes, as `RouteAwareService` automatically dispatches events to their appropriate handler method.
Create a handler method named `on<EventType>` for any of [Angular's router events](https://angular.io/guide/router#router-events) and it will receive its calls .

In the following example the service will intercept navigation start and end events, but will let go of any other events:


```typescript
import { Injectable        } from '@angular/core';
import { RouteAwareService } from '@bespunky/angular-zen/router-x';

@Injectable({ providedIn: 'root' })
class MyService extends RouteAwareService
{
    // Bonus: No constructor. Will default to base constructor.

    protected onNavigationStart(event: NavigationStart): void
    {
        // Act on navigation start...
    }
    
    protected onNavigationEnd(event: NavigationEnd): void
    {
        // Act on navigation end...
    }
}
```

> Consider marking your handlers `protected` as they are usually intended for internal class use.

# Component Bus
Route aware services integrate seamlessly with [`RouterOutletComponentBus`](/Modules/RouterXModule/RouterOutletComponentBus). Different methods in the service take advantage of the bus to provide their caller with the instance of the activated component.

# Resolves
Angular resolves work pretty well, but they don't fit all scenarios. By definition, Angular processes resolves **before** a component is loaded.

Use `resolve()` to run resolves at any given moment.

> If you provide the `componentBus` param at construction time, your resolvers will receive the instance of the component matching the active route.

### Angular Universal
In SSR, the server doesn't wait for async code to complete. The result is scrapers and search engines receiving a page without resolved data, which is bad in case you need them to read some resolved metadata tags for example.

Use `resolveInMacroTask()` to have your server block and wait for resolves before rendering.

[More Info](API)

# Deep Route Scan
Use `deepScanRoute()` to recursively run a function on the complete route tree.

> If you provide the `componentBus` param at construction time, your processing function will receive the instance of the component matching the route currently being scanned.
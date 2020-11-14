Acting as a base class for services services and components, this class creates a layer between the router and your app to help facilitate route related tasks.

# Events Dispatcher
Recognize this line...?
```typescript
    this.router.events.pipe(filter(event => event instanceof NavigationStart)).subscribe(this.onNavigationStart.bind(this));
```

Well no more... `RouteAware` automatically dispatches events to their appropriate handler method.
Create a handler method named `on<EventType>` for any of [Angular's router events](https://angular.io/guide/router#router-events) and it will receive its calls .

In the following example the service will intercept navigation start and end events, but will let go of any other events:

```typescript
import { Injectable                     } from '@angular/core';
import { NavigationStart, NavigationEnd } from '@angular/router';
import { RouteAware                     } from '@bespunky/angular-zen/router-x';

@Injectable({ providedIn: 'root' })
class MyService extends RouteAware
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
Route aware services integrate seamlessly with [`RouterOutletComponentBus`](/RouterXModule/RouterOutletComponentBus). Different methods in the service take advantage of the bus to provide their caller with the instance of the activated component.

# Resolves
Angular resolves work pretty well, but they don't fit all scenarios. By definition, Angular processes resolves **before** a component is loaded.

Use `resolve()` to run resolves at any given moment.

> If you provide the `componentBus` param at construction time, your resolvers will receive the instance of the component matching the active route.

### Angular Universal
In SSR, the server doesn't wait for async code to complete. The result is scrapers and search engines receiving a page without resolved data, which is bad in case you need them to read some resolved metadata tags for example.

Use `resolveInMacroTask()` to have your server block and wait for resolves before rendering.

[More Info](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Frouter-x%2Fservices%2Froute-aware.service.ts&version=GBmaster&line=119&lineEnd=140&lineStartColumn=1&lineEndColumn=1&lineStyle=plain&_a=contents)

# Deep Route Scan
Use `deepScanRoute()` to recursively run a function on the complete route tree.

> If you provide the `componentBus` param at construction time, your processing function will receive the instance of the component matching the route currently being scanned.

# Activated Route Component
If you provide the `componentBus` param at construction time, you can use the `activatedRouteComponent` property to fetch the instance of the active component.

# Destroyable
The class is [`Destroyable`](/CoreModule/Destroyable-\(abstract\)). You can take advantage of that when working with subscriptions.

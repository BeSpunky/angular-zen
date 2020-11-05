Acting as a base class, this service creates a layer between the router and your app to help facilitate route related tasks.

# Destroyable
The service is [`Destroyable`](/Modules/CoreModule/Destroyable). You can take advantage of that when working with subscriptions.

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


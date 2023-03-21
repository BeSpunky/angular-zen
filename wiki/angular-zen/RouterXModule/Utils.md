This module contains standalone util functions which automatically hook into the router and other services to give you an easy-to-use API.

These can be used in any component, service, directive or pipe.

> ⚠️ The `router-x` module is in PREVIEW mode. Implementation might change. Avoid using in production.
> 
> Please provide feedback on the module.


# [`useRouterEvent()`](/docs/zen/miscellaneous/functions.html#useRouterEvent)

Allows you to subscribe to a specific router event:

```typescript
import { NavigationEnd } from '@angular/router';
import { useRouterEvent } from '@bespunky/angular-zen/router-x';

class MyComponent implements OnInit
{
    private readonly navigationEnd = useRouterEvent(NavigationEnd);

    ngOnInit(): void
    {
        this.navigationEnd.subscribe(...);
    }
}
```

# [`useRouterEvents()`](/docs/zen/miscellaneous/functions.html#useRouterEvents)

Allows you to subscribe to multiple specific router events:

```typescript
import { NavigationEnd, ResolveEnd, GuardsCheckEnd } from '@angular/router';
import { useRouterEvents } from '@bespunky/angular-zen/router-x';

class MyComponent implements OnInit
{
    private readonly routingStepDone = useRouterEvents(NavigationEnd, ResolveEnd, GuardsCheckEnd);

    ngOnInit(): void
    {
        this.routingStepDone.subscribe(...);
    }
}
```

# [`useRouteDeepScan()`](/docs/zen/miscellaneous/functions.html#useRouteDeepScan)

Allows you to listen to route changes and process the activated route and its children.

See [`PublishComponentDirective`](routerxmodule/routeroutletcomponentbus/publishcomponentdirective.html) for more details on the activated component.

```typescript
import { useRouteDeepScan } from '@bespunky/angular-zen/router-x';

interface MetadataConfig
{
    resolve: (component: AnyObject | null) => Record<string, unknown>
}

function isMetadataConfig(value: unknown): value is MetadataConfig
{
    // Some implementation ...
}

class MetadataService
{
    private metadata = useRouteDeepScan(this.processRoute.bind(this))

    private processRoute({ data }: ActivatedRouteSnapshot, component: AnyObject | null): ObservedRouteProcessFunction<ReturnType<MetadataConfig['resolve']>>
    {
        // Check for metadata config in the current child's data
        const config = data['metadata'];

        if (isMetadataConfig(config) && component)
        {
            // Use the component activated for the child's outlet to resolve data
            const metadata = config.resolve(component);        

            // Make the observable emit, then stop the current scan
            return { done: true, emit: metadata };
        }

        // Continue scanning
        return { done: false };
    }
}
```

You can also directly call `deepScanRoute()` to perform a one-time scan manually.

# [`useRouterOutletStateTracker()`](/docs/zen/miscellaneous/functions.html#useRouterOutletStateTracker)

Allows observing the current state of activated router outlets. This emits a dictionary of named outlets which holds the instances of their respective component instances.

See [`PublishComponentDirective`](routerxmodule/routeroutletcomponentbus/publishcomponentdirective.html) for more details.

```typescript
import { useRouterOutletStateTracker } from '@bespunky/angular-zen/router-x';

class Component
{
    private outletState = useRouterOutletStateTracker();

    constructor()
    {
        this.outletState.subscribe(outlets => outlets.forEach((component, outletName) =>
        {
            // Process outlet and component
        }));
    }
}
```

# [`useActivatedRouteComponent()`](/docs/zen/miscellaneous/functions.html#useActivatedRouteComponent)

Allows observing the component initialized for the currently activated route.

See [`PublishComponentDirective`](routerxmodule/routeroutletcomponentbus/publishcomponentdirective.html) for more details.

```typescript
import { useActivatedRouteComponent } from '@bespunky/angular-zen/router-x';

class SomeService
{
    private activated = useActivatedRouteComponent();

    constructor()
    {
        this.activated.subscribe(({ component, route }) => { /* Process outlet and component */ });
    }
}
```
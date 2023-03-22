This module provides strong-typed routing for Angular and auto-generates a strong-typed navigation service.

The purpose of these tools is to create a tight-relation between:
1. Our route config tree and paths
2. Our router navigation calls
3. The entity (or data structure) which corresponds to the route

> ⚠️ The `navigation-x` module is in PREVIEW mode. Implementation might change. Avoid using in production.
> 
> Please provide feedback on the module.

## Step 1 - Define your entity
Call `routeConfigFor<YOUR_ENTITY>()` to create a strongly-typed route configurator for a specific entity (or data structure) related with a route tree:

```typescript
// models/theater-show.ts
export interface TheaterShow
{
    id       : number;
    theaterId: number;
    name     : string;
    date     : Date;
}


// theater.routes.ts
import { routeConfigFor } from '@bespunky/angular-zen/router-x/navigation';
import { TheaterShow } from './models/theater-show.ts';

const theater = routeConfigFor<TheaterShow>()
```

## Step 2 - Create your route config
Use the returned configurator to wrap your Angular route and store the strongly-typed route in a const:

> **Important**  
> Pass your route config `as const`

> **Bonus**  
> To improve the auto-generated names for your navigation methods, use the `friendlyName` property in your route's config.

```typescript
// theater.routes.ts

export const theaterRoutes = theater.route({
    path: 'theaters',
    ...
    children: [
        {
            path: ':theaterId',
            ...
            children: [
                {
                    path: 'shows',
                    ...
                    children: [
                        { path: ':id', friendlyName: 'ShowDetails', ... } // <-- notice `friendlyName`
                    ]
                }
            ]
        }
    ]
} as const); // <-- notice `as const`
```

## Step 3 - Provide routes
Replace your `provideRouter()` call with `provideRouterX()` and pass in the returned route config:

> If you used `provideRoutes()` for that specific route tree, call `provideRoutesX()`.

```typescript
import { NgModule } from '@angular/core';
import { provideRouterX } from '@bespunky/angular-zen/router-x/navigation';
import { theaterRoutes } from './theater.routes';
....

@NgModule({
    ...
    providers: [ provideRouterX([ theaterRoutes ]) ]
})
export class AppModule {}
```

## Step 4 - Let the magic happen 🪄
Call `useNavigationX()` in your component/service and enjoy the auto-generated navigation service:

```typescript
import { Component } from '@angular/core';
import { useNavigationX } from '@bespunky/angular-zen/router-x/navigation';
import { theaterRoutes } from './theater.routes';
import { TheaterShow } from './models/theater-show.ts';

@Component({...})
export class AppComponent
{
    private readonly navigate = useNavigationX(theaterRoutes);

    onSomeEvent(theaterShow: TheaterShow): void
    {
        this.navigate.toShowDetails(theaterShow);
        // Or one of these:
        // this.navigate.toTheaters();
        // this.navigate.toTheatersTheaterId(theaterShow);
        // this.navigate.toTheatersTheaterIdShows(theaterShow);
    }
}
```

# Road map

* TS fixes and improvements
* Support for query variables
* Support for aux. routes
* Implement automatic creation of navigation command arrays (e.g. ['theaters', theaterId, 'shows', ...]) for advanced routing scenarios
## X for eXtension
`RouterXModule` integrates with Angular's router to extend its capacities.

## Importing The Module
Some of the services in the module are independent and will work even when the module is not imported. For better tree-shaking it is prefer importing `RouterXModule` only when specified in the docs.

Use `RouterXModule.forRoot()` when importing in `AppModule`.  
Use `RouterXModule.forChild()` when importing in child/feature modules.

## Navigation-X
### Checkout the new [`navigation-x` child-module](routerxmodule/navigationx.html) for magical routing capabilities. 🪄

## Utils
### Checkout the new [standalone routing utils](routerxmodule/utils.html). 🪄

## Services

| Name                                                                        | Description                                                                                                                                                                     | Module Independent                                               |
|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------:|
| [UrlReflectionService](routerxmodule/urlreflectionservice.html)         | Provides to reflect on urls and extract their different parts.                                                                                                                  | ❌                                                               |
| [RouterOutletComponentBus](routerxmodule/routeroutletcomponentbus.html) | Provides access to the instances of components activated by router outlets. Used together with [`PublishComponentDirective`](routerxmodule/routeroutletcomponentbus/publishcomponentdirective.html). | [❕](routerxmodule/routeroutletcomponentbus.html#How-to-use) |
| [RouteAware (abstract)](routerxmodule/routeaware-(abstract).html)                                        | Simplified the creation of services and components that work with routes.                                                                                                                      | ✔                                                               |

## Directives

| Name                                                                          | Description                                                                                                                                       |
|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| [PublishComponentDirective](routerxmodule/routeroutletcomponentbus/publishcomponentdirective.html) | Integrates with router outlets to publish activated components to [`RouterOutletComponentBus`](routerxmodule/routeroutletcomponentbus.html). |

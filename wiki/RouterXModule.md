## X for eXtension
`RouterXModule` integrates with Angular's router to extend its capacities.

## Importing The Module
Some of the services in the module are independent and will work even when the module is not imported. For better tree-shaking it is prefer importing `RouterXModule` only when specified in the docs.

Use `RouterXModule.forRoot()` when importing in `AppModule`.  
Use `RouterXModule.forChild()` when importing in child/feature modules.

## Services

| Name                                                                        | Description                                                                                                                                                                     | Module Independent                                               |
|-----------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------:|
| [UrlReflectionService](RouterXModule/UrlReflectionService.html)         | Provides to reflect on urls and extract their different parts.                                                                                                                  | ❌                                                               |
| [RouterOutletComponentBus](RouterXModule/RouterOutletComponentBus.html) | Provides access to the instances of components activated by router outlets. Used together with [`PublishComponentDirective`](RouterXModule/RouterOutletComponentBus/PublishComponentDirective.html). | [❕](RouterXModule/RouterOutletComponentBus.html#How-to-use) |
| [RouteAware (abstract)](RouterXModule/RouteAware-(abstract).html)                                        | Simplified the creation of services and components that work with routes.                                                                                                                      | ✔                                                               |

## Directives

| Name                                                                          | Description                                                                                                                                       |
|-------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------|
| [PublishComponentDirective](RouterXModule/RouterOutletComponentBus/PublishComponentDirective.html) | Integrates with router outlets to publish activated components to [`RouterOutletComponentBus`](RouterXModule/RouterOutletComponentBus.html). |

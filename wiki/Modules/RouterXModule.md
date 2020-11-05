# X for eXtension
`RouterXModule` integrates with Angular's router to extend its capacities.

# Importing The Module
Most of the services in the module don't require importing it.


Use `RouterXModule.forRoot()` to import 

# Services

| Name                                                                | Description                                                                                                                             | Works Without Module                                             |
|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|:----------------------------------------------------------------:|
| [RouterOutletComponentBus](/Modules/RouterXModule/RouterOutletComponentBus)                                    | Provides access to the instances of components activated by router outlets. Used together with [`PublishComponentDirective`](/Modules/RouterXModule/PublishComponentDirective). | [❕](/Modules/RouterXModule/RouterOutletComponentBus#How-to-use) |
| [UrlReflectionService](/Modules/RouterXModule/UrlReflectionService) | Provides to reflect on urls and extract their different parts.                                                                          | ✔                                                               |
| [RouteAwareService (abstract)](LINK)                                | Simplified the creation of services that work with routes.                                                                              | ✔                                                               |

# Directives

| Name                              | Description                                                                                   |
|-----------------------------------|-----------------------------------------------------------------------------------------------|
| [PublishComponentDirective](/Modules/RouterXModule/PublishComponentDirective) | Integrates with router outlets to publish activated components to [`RouterOutletComponentBus`](/Modules/RouterXModule/RouterOutletComponentBus) . |

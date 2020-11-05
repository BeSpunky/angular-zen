# X for eXtension
`RouterXModule` integrates with Angular's router to extend its capacities.

# Importing The Module
Most of the services in the module don't require importing it.


Use `RouterXModule.forRoot()` to import 

# Services

| Name                                                                | Description                                                                                                                             | Works Without Module                                  |
|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|:-------------------------------------------------------:|
| [RouterOutletComponentBus](LINK)                                    | Provides access to the instances of the components activated by router outlets. Used together with [`PublishComponentDirective`](LINK). | [❕](/Modules/RouterXModule/RouterOutletComponentBus#How-to-use) |
| [UrlReflectionService](/Modules/RouterXModule/UrlReflectionService) | Provides to reflect on urls and extract their different parts.                                                                          | ✔                                                    |
| [RouteAwareService (abstract)](LINK)                                | Simplified the creation of services that work with routes.                                                                              | ✔                                                    |

# Directives

| Name                              | Description                                                                                   |
|-----------------------------------|-----------------------------------------------------------------------------------------------|
| [PublishComponentDirective](LINK) | Integrates with router outlets to publish activated components to `RouterOutletComponentBus`. |

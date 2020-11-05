# X for eXtension
`RouterXModule` integrates with Angular's router to extend its capacities.

# Services

| Name                                                                | Description                                                                                                                             |
|---------------------------------------------------------------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| [RouterOutletComponentBus](LINK)                                    | Provides access to the instances of the components activated by router outlets. Used together with [`PublishComponentDirective`](LINK). |
| [UrlReflectionService](/Modules/RouterXModule/UrlReflectionService) | Provides to reflect on urls and extract their different parts.                                                                          |
| [RouteAwareService (abstract)](LINK)                                | Simplified the creation of services that work with routes.                                                                              |

# Directives

| Name                              | Description                                                                                   |
|-----------------------------------|-----------------------------------------------------------------------------------------------|
| [PublishComponentDirective](LINK) | Integrates with router outlets to publish activated components to `RouterOutletComponentBus`. |

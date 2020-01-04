# Modules
`@bespunky/angular-zen` exports the following modules:

| Name | Description |
| ---  | ---         |
| [`ZenModule`](Modules/ZenModule) | The main module of the library. Depends on and exports all other modules.
| [`CoreModule`](Modules/CoreModule) | Contains general tools that normally serve for infrastructure code |
| [`AsyncModule`](Modules/AsyncModule) | Contains tools for dynamically loading scripts on to the page    |
| [`UniversalModule`](Modules/UniversalModule) | Contains tools for working easily with Angular Universal and SSR |

# Exports Hierarchy
The following diagram shows the which modules export which modules and the tools they export:

![Hierarchy](.attachments/hierarchy.png)

> You may import all tools simply by importing `ZenModule`  itself, as it exports the rest of the modules.
> However, if you only require a few specific tools, it is recommended that you import only the modules (e.g. `AsyncModule`) you need in order to optimize your code.

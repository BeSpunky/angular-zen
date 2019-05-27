# Modules
`angular-zen` exports the following modules:

| Name | Description |
| ---  | ---         |
| [`ZenModule`](Modules/ZenModule) | The main module of the library. Depends on and exports all other modules.
| [`CoreModule`](Modules/CoreModule) | Contains general tools that normally serve for infrastructure code |
| [`LoaderModule`](Modules/LoaderModule) | Contains tools for dynamically loading scripts on to the page    |

> You may import all tools simply by importing `ZenModule` by itself, as it exports the rest of the modules.
> However, if you only require a few specific tools, it is recommended that you import only the modules (e.g. `LoaderModule`) you need in order to optimize your code.
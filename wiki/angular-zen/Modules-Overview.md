`@bespunky/angular-zen` exports the following modules:

| Name | Description |
| ---  | ---         |
| [`CoreModule`](coremodule.html) | Contains general tools that normally serve for infrastructure code. |
| [`AsyncModule`](asyncmodule.html) | Contains tools for handling dynamic and async situations on the page.    |
| [`UniversalModule`](universalmodule.html) | Contains tools for working easily with Angular Universal and SSR. |
| [`RouterXModule`](routerxmodule.html) | Contains tools for routing related tasks. |
| [`LanguageIntegrationModule`](languageintegrationmodule.html) | Contains tools for integrating your library with your user's language services. |

## Shared Module
If you find yourself frequently importing the same modules, consider creating a shared module for them and import that module instead:

1. Create the shared module:
    >  `ng generate module path/to/module/SharedZen`

2. Import zen modules into the shared module:
   ```typescript
    import { NgModule } from '@angular/core';

    // 1. Import modules (notice the from clause)
    import { CoreModule      } from '@bespunky/angular-zen/core';
    import { AsyncModule     } from '@bespunky/angular-zen/async';
    import { UniversalModule } from '@bespunky/angular-zen/universal';

    // 2. Include in shared module
    const modules = [        
        CoreModule,
        AsyncModule,
        UniversalModule
    ];

    @NgModule({
        imports: modules,
        exports: modules
    })
    export class SharedZenModule { } 
   ```

3. Use the shared module in your app:
   ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule      } from '@angular/core';

    // 1. Import shared module
    import { SharedZenModule } from 'path/to/module/shared-zen.module';
    import { AppComponent    } from './app.component';

    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            SharedZenModule // 2. Include module in your app
        ],
        providers: [], 
        bootstrap: [AppComponent]
    })
    export class AppModule { }
   ```
   
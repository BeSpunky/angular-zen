
# Getting Started
To start using the tools provided by the library:

1. Install the npm package:
   
   `> npm install @bespunky/angular-zen`

2. Include `ZenModule` in your corresponding module:
   
   ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    import { ZenModule } from '@bespunky/angular-zen'; // 1. Import module

    import { AppComponent } from './app.component';

    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            ZenModule // 2. Import module in your app
        ],
        providers: [],
        bootstrap: [AppComponent]
    })
    export class AppModule { }
   ```
   
> In case you only want to use a specific tool, you can simply import the module that declares it instead of importing the entire library.
> Simply replace `ZenModule` with the module you need (e.g. `LoaderModule`).

> [Read about Modules](Modules) for more detailed documentation and feature-specific usage instructions.

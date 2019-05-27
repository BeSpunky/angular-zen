# Angular-Zen

[![Build status](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_apis/build/status/Build%20and%20test%20angular-zen)](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_build/latest?definitionId=27)
![Azure DevOps builds](https://img.shields.io/azure-devops/build/BeSpunky/5caac6d0-efbb-425a-9c23-192e992543d9/27.svg?style=flat-square)
![Azure DevOps tests](https://img.shields.io/azure-devops/tests/BeSpunky/BeSpunky%20Libraries/27.svg?style=flat-square)
![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/BeSpunky/BeSpunky%20Libraries/27.svg?style=flat-square)

![npm bundle size](https://img.shields.io/bundlephobia/min/@bespunky/angular-zen.svg?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/@bespunky/angular-zen.svg?style=flat-square)
![npm (scoped)](https://img.shields.io/npm/v/@bespunky/angular-zen.svg?style=flat-square)

## This project is still a work in progress. **Not for production**.
`angular-zen` provides a set of general purpose tools written by our team at BeSpunky.
These tools can be used with any app and you may use them as you like.

> The library was written and tested in angular 7 but might work with older versions.


# 🎁 What's Inside the Library?
`angular-zen` exports the following modules:

| Name | Description |
| ---  | ---         |
| [`ZenModule`](TODO) | The main module of the library. Depends on and exports all other modules.
| [`CoreModule`](TODO) | Contains general tools that normally serve for infrastructure code |
| [`LoaderModule`](TODO) | Contains tools for dynamically loading scripts on to the page    |

# 📖 Documentation

All modules / components / services are documented within the code. Some might have their own `Readme.md` file accessible at their folder.

### The complete workspace documentation is found online at [Angular-Zen Wiki](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_wiki/wikis/angular-zen?wikiVersion=GBmaster&pageId=80&pagePath=%2Fhome).

# ✨ Getting Started
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

> [See wiki](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_wiki/wikis/angular-zen?wikiVersion=GBmaster&pageId=80&pagePath=%2Fhome) for more detailed documentation and feature-specific usage.

> You may import all tools simply by importing `ZenModule` by itself, as it exports the rest of the modules.
> However, if you only require a few specific tools, it is recommended that you import only the modules (e.g. `LoaderModule`) you need in order to optimize your code.


# Angular CLI

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

## Code scaffolding

Run `ng generate component component-name --project angular-zen` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project angular-zen`.
> Note: Don't forget to add `--project angular-zen` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build angular-zen` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build angular-zen`, go to the dist folder `cd dist/angular-zen` and run `npm publish`.

## Running unit tests

Run `ng test angular-zen` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

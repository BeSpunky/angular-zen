# @bespunky/angular-zen

[![Build status](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_apis/build/status/Build%20and%20test%20angular-zen)](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_build/latest?definitionId=27)
![Azure DevOps builds](https://img.shields.io/azure-devops/build/BeSpunky/5caac6d0-efbb-425a-9c23-192e992543d9/27.svg?style=flat-square)
![Azure DevOps tests](https://img.shields.io/azure-devops/tests/BeSpunky/BeSpunky%20Libraries/27.svg?style=flat-square)
![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/BeSpunky/BeSpunky%20Libraries/27.svg?style=flat-square)

![npm bundle size](https://img.shields.io/bundlephobia/min/@bespunky/angular-zen.svg?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/@bespunky/angular-zen.svg?style=flat-square)
![npm (scoped)](https://img.shields.io/npm/v/@bespunky/angular-zen.svg?style=flat-square)

## This project is still a work in progress. **Not for production**.
`@bespunky/angular-zen` provides a set of **🌳 tree-shakable** general purpose tools written by our team at BeSpunky.
These tools can be used with any app and you may use them as you like under the MIT license.

🙌 Examples in [live demo project](https://bs-angular-zen-demo.firebaseapp.com).  
  
> The library was generated using Angular 7 and has been updated and tested on Angular 8 and 9. Compatibility with older versions is possible but not garantied.

# 🎁 What's Inside the Library?
`@bespunky/angular-zen` exports the following modules:

| Name | Description |
| ---  | ---         |
| [`CoreModule`](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_wiki/wikis/angular-zen?pagePath=%2FModules%2FCoreModule&wikiVersion=GBmaster) | Contains general tools that normally serve for infrastructure code. |
| [`AsyncModule`](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_wiki/wikis/angular-zen?pagePath=%2FModules%2FAsyncModule&wikiVersion=GBmaster) | Contains tools for handling dynamic and async situations on the page.    |
| [`UniversalModule`](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_wiki/wikis/angular-zen?pagePath=%2FModules%2FUniversalModule&wikiVersion=GBmaster) | Contains tools for working easily with Angular Universal and SSR |

# 📖 Documentation

All modules / components / services are documented within the code. Some might have their own `Readme.md` file accessible at their folder.

The complete workspace documentation is found online at [angular-zen wiki](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_wiki/wikis/angular-zen/Wiki-Home).

# ✨ Getting Started
1. Install the npm package:
   
   `> npm install @bespunky/angular-zen`

2. Include the module you need in your corresponding app/feature module:
   
   ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    import { AsyncModule } from '@bespunky/angular-zen/async'; // 1. Import module

    import { AppComponent } from './app.component';

    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            AsyncModule // 2. Include module in your app
        ],
        providers: [], 
        bootstrap: [AppComponent]
    })
    export class AppModule { }
   ```

> 🌳 The library is intended to be tree-shakable, which is why it is constructed as a set of separate modules. Remember to import from the corresponding module (e.g. `@bespunky/angular-zen/async`), and not directly from `@bespunky/angular-zen`.
>
> [More about modules](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_wiki/wikis/angular-zen/112/Modules) and feature-specific information in the full wiki.

# Angular CLI

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.2.0.

## Code scaffolding

Run `ng generate component component-name --project angular-zen` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module --project angular-zen`.
> Note: Don't forget to add `--project angular-zen` or else it will be added to the default project in your `angular.json` file. 

## Build

Run `ng build angular-zen` to build the project. The build artifacts will be stored in the `dist/` directory.

## Publishing

After building your library with `ng build angular-zen`, go to the dist folder `cd dist/bespunky/angular-zen` and run `npm publish`.

## Running unit tests

Run `ng test angular-zen` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

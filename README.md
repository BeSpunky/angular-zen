![npm (scoped)](https://img.shields.io/npm/v/@bespunky/angular-zen?style=flat-square&label=version)
![npm bundle size (scoped)](https://img.shields.io/bundlephobia/min/@bespunky/angular-zen?style=flat-square)
![GitHub package.json dependency version (prod)](https://img.shields.io/github/package-json/dependency-version/bespunky/angular-zen/@angular/core?style=flat-square)
[![Contributor Covenant](https://img.shields.io/badge/Contributor%20Covenant-v2.0%20adopted-ff69b4.svg?style=flat-square)](https://github.com/BeSpunky/angular-zen/blob/master/code_of_conduct.md)
![GitHub](https://img.shields.io/github/license/bespunky/angular-zen?style=flat-square)
![npm](https://img.shields.io/npm/dt/@bespunky/angular-zen?style=flat-square)

<p align="center">
    <img src="https://bs-angular-zen.web.app/docs/zen/.attachments/logo.svg" width="200"/>
</p>

<p align="center" style="font-size: x-large">@bespunky/angular-zen</p>
<p align="center" style="font-size: medium">The Angular tools you always wished were there.</p>

<p align="center" style="font-size: medium; margin: 20px auto">
    ✨ <a href="https://bs-angular-zen.web.app/docs/zen/additional-documentation/getting-started.html">Getting Started</a> |
    🙌 <a href="https://bs-angular-zen.web.app/">Official Site & Live Demos</a> |
    🎁 <a href="https://bs-angular-zen.web.app/docs/zen/additional-documentation/modules-overview.html">What's in the library?</a>
</p>

## 🧘‍♂️ Zen...
`@bespunky/angular-zen` provides a set of well meditated general purpose tools for common Angular related tasks, to help you keep focused on the task at hand and stay in control of your workflow. These tools are all **🌳 tree-shakable**.

You may use the library as you like, with any app, under the MIT license.

## ✨ The Highlights

[💥`Destroyable`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/destroyable-(abstract).html) - No more manual `unsubscribe()` calls.

[🔀 `RouteAware`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/routerxmodule/routeaware-\(abstract\).html) - React to `Router` events and handle routing with less code.

[🚌 `RouterOutletComponentBus`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/routerxmodule/routeroutletcomponentbus.html) - Access outlet activated components instantaneously.

[🔗 `UrlReflectionService`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/routerxmodule/urlreflectionservice.html) - Break and analyze urls and their parts.

[🔲 `WindowRef`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/windowref.html) - The safe way to access the `window` object.

[📄 `DocumentRef`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/documentref.html) - The safe way to access the `document` object.

[😎 `HeadService`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/headservice.html) - Cleanly access and manipulate the head element.

[⏳ `LazyLoaderService`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/asyncmodule/lazyloaderservice.html) - Programmatically load scripts and styles.

[🌎 `Universal Platform Directives`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/universalModule/platform-directives.html) - Prevent element rendering in Universal with directives.

[⚙ `LanguageIntegrationService`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/languageintegrationmodule.html) - Hook your library with your user's language services.

[🗣 `LocalizedRouteAware`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/languageintegrationmodule/localizedrouteaware-\(abstract\).html) - Create route aware services and components with language integration.

## Versions
The library was generated using Angular 7 and has been gradually updated and tested up to Angular 11. 
Compatibility with older versions is possible but not guaranteed.

[Full change log](https://bs-angular-zen.web.app/docs/zen/changelog.html)

## Supporting The Project
If you like this project, find it useful and want to donate, you're welcome to buy me a coffee 😊. If you can't, no worries. A simple 'hello' or 'thank you' always warms my heart. 💗

<a href="https://www.buymeacoffee.com/bespunky"><img src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=bespunky&button_colour=FFDD00&font_colour=000000&font_family=Cookie&outline_colour=000000&coffee_colour=ffffff"></a>

## Issues & Requests
Feedback, bugs reports and pull requests are welcome.
Please follow the [contribution guidelines]().

## Other Packages by [`@bespunky`](https://www.npmjs.com/~bespunky)

📦 [`@bespunky/angular-google-maps`](https://bs-angular-g-maps.web.app)

🚧 (soon) `@bespunky/angular-zen-ux` will help you with simple UX tasks.

🚧 (soon) `@bespunky/angular-zen-seo` will help you with metadata and SEO related tasks.

## References
[Source Code](https://github.com/bespunky/angular-zen)

[NPM Package](https://www.npmjs.com/package/@bespunky/angular-zen)

# Angular-Zen Workspace

[![Build status](https://dev.azure.com/BeSpunky/Libraries/_apis/build/status/angular-zen/Build%20angular-zen)](https://dev.azure.com/BeSpunky/Libraries/_build/latest?definitionId=29)

This angular **workspace** provides:
- The `@bespunky/angular-zen` library containing a set of **🌳 tree-shakable** general purpose tools written by our team at BeSpunky.
- The official website which also contains demos.

> When published to npm, only the library itself is published.

# 📖 Documentation

All modules / components / services are documented within the code. Some might have their own `Readme.md` file accessible at their folder.

The complete documentation is found in the `wiki` folder, and is also accessible online at [the official docs site](https://bs-angular-zen.web.app/docs/zen/index.html).

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

> ### Production
> Tests are configured to generate reports for production:
> - `JUnit` reports under the `tests` folder
> - `Cobertura` reports for code coverage under the `coverage` folder
>
> To run tests with production configuration, use `npm run test`.

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

> ### Production
> e2e tests are configured to generate reports for production:
> - `JUnit` reports under the `tests` folder
>
> To run tests with production configuration, use `npm run e2e`.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).

# Firebase CLI
The official website app for this library is hosted on firebase and the workspace has been initialized using firebase CLI.
To publish the site project, use `npm run build-site && npm run publish-site` which will build the app and the compodoc documentation, then publish them to firebase.

# NPM Scripts
The workspace also defines custom npm scripts in `package.json`.  
They can be run calling `npm run <scriptName>`:

| Name | Action | Special Usage |
| ---  | ---    | ---           |
| test | Runs workspace tests once and produces JUnit and code coverage reports | |
| e2e | Runs the official site project's e2e tests agains the production configuration in `protractor.conf.js`. This adds reports and uses ChromeHeadless`.| |
| lib-v`<version>` | Stashes any WIP, bumps up the library's version, commits with a message then pops previous WIP. | Replace `<version>` with one of major/minor/patch. |
| app-v`<version>` | Stashes any WIP, bumps up the app's version, commits with a message then pops previous WIP. | Replace `<version>` with one of major/minor/patch. |
| v`<version>` | Runs `lib-v<version>` then runs `app-v<version>` | Replace `<version>` with one of major/minor/patch. |
| publish-site | Deploys the official site app to firebase | If needed, a token can be provided when running the script: `npm run publish-site -- --token TheTokenObtainedFromFirebase` |

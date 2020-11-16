[![Build status](https://dev.azure.com/BeSpunky/Libraries/_apis/build/status/angular-zen/Build%20angular-zen)](https://dev.azure.com/BeSpunky/Libraries/_build/latest?definitionId=29)
![Azure DevOps builds](https://img.shields.io/azure-devops/build/bespunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)
![Azure DevOps tests](https://img.shields.io/azure-devops/tests/BeSpunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)
![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/BeSpunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)

![npm bundle size](https://img.shields.io/bundlephobia/min/@bespunky/angular-zen.svg?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/@bespunky/angular-zen.svg?style=flat-square)
![npm (scoped)](https://img.shields.io/npm/v/@bespunky/angular-zen.svg?style=flat-square)

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

You know the feeling... It's late at night and you want to write a class method. Suddenly you find yourself spending hours on some infrastructural piece just so you can start implementing the method. 😪

## 🧘‍♂️ Enter Zen...
`@bespunky/angular-zen` provides a set of well meditated general purpose tools for common Angular related tasks, to help you keep focused on the task at hand and stay in control of your workflow. These tools are all **🌳 tree-shakable**.

You may use the library as you like, with any app, under the MIT license.

## ✨ The Highlights

| [🔲 `WindowRef`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/windowref.html) | [📄 `DocumentRef`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/documentref.html) | [💥`Destroyable`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/destroyable-(abstract).html) |
|:------------------------------------------------:|:----------------------------------------------------:|:--------------------------------------------------------------:|
| The safe way to access the `window` object. | The safe way to access the `document` object. | No more manual `unsubscribe()` calls. |


| [😎 `HeadService`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/headservice.html) | [⏳ `LazyLoaderService`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/asyncmodule/lazyloaderservice.html) | [🌎 `Universal Platform Directives`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/universalModule/platform-directives.html) | 
|:----------------------------------------------------------------:|:-----------------------------------------------------------------------------------:|:---------------------------------------------------------------------:|
| Cleanly access and manipulate the head element. | Programmatically load scripts and styles. | Prevent element rendering in Universal with directives. |

| [⚙ `LanguageIntegrationService`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/languageintegrationmodule.html) | [🔗 `UrlReflectionService`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/routerxmodule/urlreflectionservice.html) | [🚌 `RouterOutletComponentBus`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/routerxmodule/routeroutletcomponentbus.html) |
|:---------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------:|
| Hook your library with your user's language services. | Break urls to their parts. | Access outlet activated components instantaneously. |

| [🔀 `RouteAware`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/routerxmodule/routeaware-\(abstract\).html) | [🗣 `LocalizedRouteAware`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/languageintegrationmodule/localizedrouteaware-\(abstract\).html) |
|:------:|:-------:|
| Create route aware services and components with ease. | Create route aware services and components with language integration. |

## Versions
The library was generated using Angular 7 and has been gradually updated and tested up to Angular 10. 
Compatibility with older versions is possible but not guaranteed.

[Full change log](https://bs-angular-zen.web.app/docs/zen/changelog.html)

## Issues & Requests
Feedback, bugs reports and pull requests are welcome.
Please follow the [contribution guidelines]().

## Other Packages by [`@bespunky`](https://www.npmjs.com/~bespunky)

📦 [`@bespunky/angular-google-maps`](https://bs-angular-ggl-maps.web.app)

🚧 (soon) `@bespunky/angular-zen-ux` will help you with simple UX tasks.

🚧 (soon) `@bespunky/angular-zen-seo` will help you with metadata and SEO related tasks.

## References
[Source Code](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen)

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

# Angular CLI

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 7.3.3.

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

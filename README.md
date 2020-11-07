[![Build status](https://dev.azure.com/BeSpunky/Libraries/_apis/build/status/angular-zen/Build%20angular-zen)](https://dev.azure.com/BeSpunky/Libraries/_build/latest?definitionId=29)
![Azure DevOps builds](https://img.shields.io/azure-devops/build/bespunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)
![Azure DevOps tests](https://img.shields.io/azure-devops/tests/BeSpunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)
![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/BeSpunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)

![npm bundle size](https://img.shields.io/bundlephobia/min/@bespunky/angular-zen.svg?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/@bespunky/angular-zen.svg?style=flat-square)
![npm (scoped)](https://img.shields.io/npm/v/@bespunky/angular-zen.svg?style=flat-square)

<p align="center">
    <img src="https://dev.azure.com/BeSpunky/bebdc696-fbbf-4816-9247-9d1311da59bc/_apis/git/repositories/1f3eb3c0-8f08-46b0-a3bf-f2ea2225a0a5/items?path=%2Fprojects%2Fdemo%2Fsrc%2Fassets%2Flogo%400.75x.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=development&resolveLfs=true&%24format=octetStream&api-version=5.0"/>
</p>

<p align="center" style="font-size: x-large">@bespunky/angular-zen</p>
<p align="center" style="font-size: medium">The Angular tools you always wished were there.</p>

<p align="center" style="font-size: medium; margin: 20px auto">
    ✨ <a href="https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=Getting-Started">Getting Started</a> |
    🙌 <a href="https://bs-angular-zen-demo.web.app/">Live Demo</a> |
    🎁 <a href="https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=Modules">What's in the library?</a>
</p>

You know the feeling... It's late at night and you want to write a class method. Suddenly you find yourself spending hours on some infrastructural piece just so you can start implementing the method. 😪

# 🧘‍♂️ Enter Zen...
`@bespunky/angular-zen` provides a set of well meditated general purpose tools for common Angular related tasks, to help you keep focused on the task at hand and stay in control of your workflow. These tools are all **🌳 tree-shakable**.

You may use the library as you like, with any app, under the MIT license.

# ✨ The Highlights

| [🔲 `WindowRef`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/CoreModule/WindowRef) | [📄 `DocumentRef`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/CoreModule/DocumentRef) | [💥`Destroyable`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/CoreModule/Destroyable-(abstract)) | [😎 `HeadService`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/CoreModule/HeadService) |
|:------------------------------------------------:|:----------------------------------------------------:|:--------------------------------------------------------------:|:----------------------------------------------------:|
| The safe way to access the `window` object.      | The safe way to access the `document` object         | No more manual `unsubscribe()` calls.                          | Cleanly access and manipulate the head element.      |


| [⏳ `LazyLoaderService`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/AsyncModule/LazyLoaderService) | [🌎 `Universal Platform Directives`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/UniversalModule/Platform-Directives) | [⚙ `LanguageIntegrationService`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/LanguageIntegrationModule) | [🔗 `UrlReflectionService`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/LanguageIntegrationModule/Additional-Language-Tools#UrlReflectionService) |
|:----------------------------------------------------------------:|:-----------------------------------------------------------------------------------:|:---------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------:|
| Programmatically load scripts and styles.                        | Prevent element rendering in Universal with directives.                             | Hook your library with your user's language services.                 | Break urls to their parts.                                                                                      |

| [🚌 `RouterOutletComponentBus`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/RouterXModule/RouterOutletComponentBus) | [🔀 `RouteAwareService`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/RouterXModule/RouteAwareService-\(abstract\)) | [🗣 `LocalizedRouteAwareService`](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?pagePath=/Modules/LanguageIntegrationModule/Additional-Language-Tools#LocalizedRouteAwareService-\(abstract\)) |
|:---------------------------------------------------------------------------------:|:--------------------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------------------------------:|
| Access outlet activated components instantaneously.                               | Create route aware services with ease.                                           | Create route aware services with language integration.                                                                                  |

# Versions
The library was generated using Angular 7 and has been gradually updated and tested up to Angular 10. 
Compatibility with older versions is possible but not guaranteed.

# Issues & Requests
Unfortunately, Azure DevOps doesn't support issue collection. I'm considering moving this repo to GitHub.  
In the meantime, any issues or requests can be sent to [us@bespunky.io](mailto:us@bespunky.io?subject=@bespunky/angular-zen).

# Other Packages by [`@bespunky`](https://www.npmjs.com/~bespunky)

📦 [`@bespunky/angular-google-maps`](https://www.npmjs.com/package/@bespunky/angular-google-maps)

🚧 (soon) `@bespunky/angular-zen-ux` will help you with simple UX tasks.

🚧 (soon) `@bespunky/angular-zen-seo` will help you with metadata and SEO related tasks.

# References
[Source Code](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen)

[NPM Package](https://www.npmjs.com/package/@bespunky/angular-zen)

# Angular-Zen Workspace

[![Build status](https://dev.azure.com/BeSpunky/Libraries/_apis/build/status/angular-zen/Build%20angular-zen)](https://dev.azure.com/BeSpunky/Libraries/_build/latest?definitionId=29)

This angular **workspace** provides:
- The `@bespunky/angular-zen` library containing a set of **🌳 tree-shakable** general purpose tools written by our team at BeSpunky.
- A `demo` app with examples.

> When published to npm, only the library itself is published.

# 🙌 Examples
The demo app is **live** at [angular-zen demo](https://bs-angular-zen-demo.firebaseapp.com).  
For implementation, [visit the code](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen?path=%2Fprojects%2Fdemo&version=GBmaster&_a=contents) for the demo app.

Each module in the library has its dedicated folder in the demo app.

# 📖 Documentation

All modules / components / services are documented within the code. Some might have their own `Readme.md` file accessible at their folder.

The complete documentation is found in the [wiki folder](/wiki/Wiki-Home.md), and is also accessible online at [angular-zen wiki](https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen?wikiVersion=GBmaster&pagePath=%2FWiki%20Home).

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
The demo app for this library is hosted on firebase and the workspace has been initialized using firebase CLI.
To publish the demo project, use `npm run publish-demo` which will publish the demo app.

After AOT compilation, the demo app will be flattened, which is why firebase.json defines the public folder as working directory.
```json
{
    "hosting": {
        "site": "bs-angular-zen-demo",
        "public": ".", // <-- This
        "ignore": [
            "firebase.json",
            "**/.*",
            "**/node_modules/**"
        ],
        "rewrites": [{
            "source": "**",
            "destination": "/index.html"
        }]
    }
}
```

# NPM Scripts
The workspace also defines custom npm scripts in `package.json`.  
They can be run calling `npm run <scriptName>`:

| Name | Action | Special Usage |
| ---  | ---    | ---           |
| test | Runs workspace tests once and produces JUnit and code coverage reports | |
| e2e | Runs the demo project's e2e tests agains the production configuration in `protractor.conf.prod.js`. This adds reports and uses ChromeHeadless`.| |
| lib-v`<version>` | Stashes any WIP, bumps up the library's version, commits with a message then pops previous WIP. | Replace `<version>` with one of major/minor/patch. |
| app-v`<version>` | Stashes any WIP, bumps up the app's version, commits with a message then pops previous WIP. | Replace `<version>` with one of major/minor/patch. |
| v`<version>` | Runs `lib-v<version>` then runs `app-v<version>` | Replace `<version>` with one of major/minor/patch. |
| publish-demo | Deploys the demo app to firebase | If needed, a token can be provided when running the script: `npm run publish-demo -- --token TheTokenObtainedFromFirebase` |

# Angular-Zen Workspace

[![Build status](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_apis/build/status/Build%20and%20test%20angular-zen)](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_build/latest?definitionId=27)

This angular **workspace** provides:
- The `@bespunky/angular-zen` library containing a set of general purpose modules and tools written by our team at BeSpunky
- A `demo` app with examples.

> When published to npm, only the library itself is published.

# 🙌 Examples
The demo app is **live** at [Angular-Zen Demo](https://bs-angular-zen-demo.firebaseapp.com).  
For implementation, [visit the code](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_git/angular-zen?path=%2Fprojects%2Fdemo&version=GBmaster&_a=contents) for the demo app.


Each module in the library has its dedicated folder in the demo app.

# 📖 Documentation

All modules / components / services are documented within the code. Some might have their own `Readme.md` file accessible at their folder.

### The complete documentation is found in the [wiki folder](/wiki/Wiki-Home.md), and is also accessible only at [Angular-Zen Wiki](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_wiki/wikis/angular-zen?wikiVersion=GBmaster&pageId=80&pagePath=%2FWiki%20Home).

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

To publish the demo project, use `npm run publish-demo` which will build and publish the app.

# NPM Scripts
The workspace also defines custom npm scripts in `package.json`.  
They can be run calling `npm run <scriptName>`:

| Name | Action | Special Usage |
| ---  | ---    | ---           |
| test | Runs workspace tests once and produces JUnit and code coverage reports | |
| e2e | Runs the demo project's e2e tests agains the production configuration in `protractor.conf.prod.js`. This adds reports and uses ChromeHeadless`.| |
| lib-`<version>` | Stashes any WIP, bumps up the library's version, commits with a message then pops previous WIP. | Replace `<version>` with one of major/minor/patch. |
| app-`<version>` | Stashes any WIP, bumps up the app's version, commits with a message then pops previous WIP. | Replace `<version>` with one of major/minor/patch. |
| v`<version>` | Runs `lib-<version>` then runs `app-<version>` | Replace `<version>` with one of major/minor/patch. |
| publish-demo | Builds the demo app in production mode and deploys it to firebase | If needed, a token can be provided when running the script: `npm run publish-demo -- --token TheTokenObtainedFromFirebase` |

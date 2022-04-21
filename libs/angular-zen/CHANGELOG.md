# **v5.0.0** <small>2022-04-21</small>
## Breaking Changes
📦 Updated Angular to v13.
> No version was released for Angular v12 due to lack of time. Anyone willing to contribute?

📦 Updated peer rxjs to v7.

📦 Updated TypeScript to v4.6.2 and made some required types  adaptations.



## Other Changes
➕ Added the [`*observe` directives](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/observemodule.html).

➕ Added the [`*onObserver` directives](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/observemodule.html).

📃 Improved documentation readability and added docs for new features.


# **v4.0.0** <small>2021-04-07</small>
## Breaking Changes
🚛 Migrated to NX. Recreated entire workspace as an NX monorepo.

🚛 Migrated to Jest. All tests and testing suites now work with Jest instead of Jasmine. Watch for changes in spies returned by the testing suite.

🚛 Migrated to ESLint. Strong typing has been improved all over the codebase. Compilation might break as it now requires stricter types.

📦 Updated Angular to v11.

## Other Changes
🎨 Removed redundant escape chars from regular expressions in `UrlReflectionService`.

🐛 Fixed `UrlReflectionService.routeOf()` returns `undefined` instead of empty string when no route is present.

🐛 Fixed language service fails to extract supported languages and default language from factories.

🐛 Fixed `RoutePositionUrlLocalizer` breaks if the language service isn't enabled.

🧹 Removed redundant tests covered by TypeScript.

📃 Updated readmes.

# **v3.1.1-buy-me-a-coffee.0** <small>2021-05-08</small>
📃 Added "Buy Me a Coffee" links to readmes.

# **v3.1.0** <small>2021-02-25</small>
➕ Added conditional platform dependent execution methods to `UniversalService`.

📃 Improved readme readability.

# **v3.0.1** <small>2020-12-01</small>
🐛 Fixed `RouteAware` doesn't dispatch events to handler methods after AOT compilation.

# **v3.0.0** <small>2020-11-16</small>

🐛 Fixed `HeadService` fails to add `<link>` elements in SSR.

♻ Replaced document provider for `DOCUMENT`. Angular's `DOCUMENT` token will be used by default.

➕ Added the [`language`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/languageintegrationmodule.html) module for libraries requiring centralized language services.

➕ Added the [`router-x`](https://bs-angular-zen.web.app/docs/zen/additional-documentation/routerxmodule.html) module with sexy routing tools.

✨ Implemented API reference and wiki using compodoc.

✨ Created and launched [official @bespunky/angular-zen website](https://bs-angular-zen.web.app).

📃 Improved docs and doc coverage.

📦 Updated Angular to v10.2.2.

# **v2.6.0** <small>2020-09-18</small>
➕ Added methods for quick `<link>` removal.

# **v2.5.0** <small>2020-09-18</small>
➕ Added wildcard support for attribute matching in `<head>`.

# **v2.4.0** <small>2020-09-16</small>

➕ Added a CHANGELOG.md file.

➕ Added a `Destroyable` abstract class.

➕ Added automatic detection of previously existing script and style elements before lazy loading.

➕ Added API for programmatic detection of existing script and style elements.

➕ Added a `HeadService` for `<head>` elements manipulation.

♻ Replaced usage of deprecated rxjs and angular methods.

👴 Deprecated `LazyLoaderService.isLoaded()`. Replaced with `LazyLoaderService.isCached()`.
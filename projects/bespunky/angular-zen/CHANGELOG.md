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
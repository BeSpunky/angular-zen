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
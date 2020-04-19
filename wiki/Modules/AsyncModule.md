# Services

| Name | Description |
| ---  | ---         |
| [LazyLoaderService](AsyncModule/LazyLoaderService) | Provides tools for loading scripts and styles on runtime. |

# Utils
The module also contains a set of exported functions that are available regardless of importing the `AsyncModule`.
Use these functions simply by importing and calling them:

| Function | Description |
| ---      | ---         |
| [`promiseLater()`](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Fasync%2Futils%2FpromiseLater.ts&version=GBmaster) | Creates a promise which doesn't have the actual async code to resolve, and extracts its `resolve()` and `reject()` methods for later use. |
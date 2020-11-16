## Services

| Name | Description |
| ---  | ---         |
| [LazyLoaderService](asyncmodule/lazyloaderservice.html) | Provides tools for loading scripts and styles on runtime. |

## Utils
The module also contains a set of exported functions that are available regardless of importing the `AsyncModule`.
Use these functions simply by importing and calling them:

| Function | Description |
| ---      | ---         |
| [`promiseLater()`](/miscellaneous/functions.html#promiseLater) | Creates a promise which doesn't have the actual async code to resolve, and extracts its `resolve()` and `reject()` methods for later use. |
# WindowRef Internals
The `WindowRef` service has some friends that accompany it and help it acheive its goal: **DI & Testability**.

`CoreModule` exports the following elements as part of the `WindowRef` mechanism:
| Name | Purpose | Default Implementation |
| ---  | ---     | ---                    |
| `WINDOW` | An injectable token allowing the definition or redefinition of what the `window` value is. | See `WindowProvider`.
| `WindowProvider` | The default provider for `WINDOW`. A factory provider defining a platform dependant way of retrieving the `window` object. | Returns `window` or an empty object directly. |
| `WindowRefProviders` | A bundle of all providers defined by the `WindowRef` module allowing a quick import. | Currently only includes `WindowProvider`. |

See [code file](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Fsrc%2Flib%2Fcore%2FWindowRef%2Fwindow-ref.service.ts&version=GBmaster) for implementation.
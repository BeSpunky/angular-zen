# `WindowRef` Internals
`WindowRef` by itself doesn't work, and will actually throw a 'not implemented' exception if you use it as-is.
The service has some friends that accompany it and help it acheive its goal: **DI & Testability**.

`CoreModule` exports 2 providers defined along with `WindowRef`:
| Name | Purpose | Default Implementation |
| ---  | ---     | ---                    |
| `DefaultWindowProvider` | Allow injection of the native `window` object through the `WINDOW` token. | Returns `window` directly. |
| `DefaultWindowRefProvider` | Provide a platform dependant access to the native object. | `PlatformDependantWindowRef` which determines if it is running on a browser and returns an appropriate object. |

See [code file](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Fsrc%2Flib%2Fcore%2FWindowRef%2Fwindow-ref.service.ts&version=GBmaster) for implementation.
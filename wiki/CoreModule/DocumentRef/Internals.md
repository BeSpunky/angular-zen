The `DocumentRef` service has some friends that accompany it and help it acheive its goal: **DI & Testability**.

`CoreModule` exports the following elements as part of the `DocumentRef` mechanism:

| Name | Purpose | Default Implementation |
| ---  | ---     | ---                    |
| `DOCUMENT` | An injectable token allowing the definition or redefinition of what the `document` value is. | See `DocumentProvider`.
| `DocumentProvider` | The default provider for `DOCUMENT`. Delegates angular's `DOCUMENT` provider. | Returns `document` as provided by angular. |
| `DocumentRefProviders` | A bundle of all providers defined by the `DocumentRef` module allowing a quick import. | Currently only includes `DocumentProvider`. |

See [code file](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Fcore%2FDocumentRef%2Fdocument-ref.service.ts&version=GBmaster) for implementation.
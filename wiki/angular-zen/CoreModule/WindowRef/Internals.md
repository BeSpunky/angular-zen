The `WindowRef` service aims at two things: **DI & Testability**.
`CoreModule` exports the following elements as part of the `WindowRef` mechanism:

| Name | Purpose | Default Implementation |
| ---  | ---     | ---                    |
| [`WINDOW`](/docs/zen/miscellaneous/variables.html#WINDOW) | An injectable token allowing the definition or redefinition of what the `window` value is. | See `WindowProvider`.
| [`WindowProvider`](/docs/zen/miscellaneous/variables.html#WindowProvider) | The default provider for `WINDOW`. A factory provider defining a platform dependant way of retrieving the `window` object. | Returns `window` or an empty object directly. |
| [`WindowRefProviders`](/docs/zen/miscellaneous/variables.html#WindowRefProviders) | A bundle of all providers defined by the `WindowRef` module allowing a quick import. | Currently only includes `WindowProvider`. |

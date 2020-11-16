The `DocumentRef` service aims at two things: **DI & Testability**.
`CoreModule` exports the following elements as part of the `DocumentRef` mechanism:

| Name | Purpose | Default Implementation |
| ---  | ---     | ---                    |
| [`DOCUMENT`](/miscellaneous/variables.html#document) | An injectable token allowing the definition or redefinition of what the `document` value is. | See `DocumentProvider`.
| [`DocumentProvider`](/miscellaneous/variables.html#documentprovider) | The default provider for `DOCUMENT`. Delegates angular's `DOCUMENT` provider. | Returns `document` as provided by angular. |
| [`DocumentRefProviders`](/miscellaneous/variables.html#documentrefproviders) | A bundle of all providers defined by the `DocumentRef` module allowing a quick import. | Currently only includes `DocumentProvider`. |
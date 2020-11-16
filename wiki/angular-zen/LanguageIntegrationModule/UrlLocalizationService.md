This service reflects on the currently navigated url and gives you the ability to easily localize and delocalize it.
For this service to work, you must provide a localization strategy when calling `LanguageIntegrationModule.forRoot()` using the optional `urlLocalization` property.

## Strategies
A localization strategy tells the localization service where and how the current language is expressed in the url.
The strategy is then transformed into a localizer class which holds the implementation.

There are 3 built-in localizers:

| Localizer                   | Instantiated when strategy is... | Implementation                                                                         |
|-----------------------------|-------------------------|----------------------------------------------------------------------------------------|
| [`RoutePositionUrlLocalizer`](/docs/zen/injectables/RoutePositionUrlLocalizer.html) | a `number`              | The language is a segment in the route. The strategy is the position within the route. |
| [`QueryParamsUrlLocalizer`](/docs/zen/injectables/QueryParamsUrlLocalizer.html)   | a `string`              | The language is a query param. The strategy is the param name.                         |
| [`NoopUrlLocalizer`](/docs/zen/injectables/NoopUrlLocalizer.html)          | not provided            | Always returns an unchanged url.                                                       |

You can also set a factory or class provider to implement your own localization strategy.
An example use case would be localization using sub-domains or host replacement for different languages.

See [`UrlLocalizationConfig`](/docs/zen/interfaces/UrlLocalizationConfig.html).

## See Also
[LanguageIntegrationModule](../languageintegrationmodule.html)

[Implementing integration in a library](implementing-in-a-library.html)

[Providing integration from an app](providing-from-an-app.html)
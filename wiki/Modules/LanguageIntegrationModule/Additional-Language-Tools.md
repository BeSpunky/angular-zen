[[_TOC_]]

# UrlLocalizationService
This service reflects on the currently navigated url and gives you the ability to easily localize and delocalize it.
For this service to work, you must provide a localization strategy when calling `LanguageIntegrationModule.forRoot()` using the optional `urlLocalization` property.

## Strategies
A localization strategy tells the localization service where and how the current language is expressed in the url.
The strategy is then transformed into a localizer class which holds the implementation.

There are 3 built-in localizers:

| Localizer                   | Instantiated when is... | Implementation                                                                         |
|-----------------------------|-------------------------|----------------------------------------------------------------------------------------|
| `RoutePositionUrlLocalizer` | a `number`              | The language is a segment in the route. The strategy is the position within the route. |
| `QueryParamsUrlLocalizer`   | a `string`              | The language is a query param. The strategy is the param name.                         |
| `NoopUrlLocalizer`          | not provided            | Always returns an unchanged url.                                                       |

You can also set a factory or class provider to implement your own localization strategy.
An example use case would be localization using sub-domains or host replacement for different languages.

See the [`LanguageIntegrationProvider.urlLocalization`](LINK TO CODE) property for complete API and documentation.

# UrlReflection
> **❗ EXPECT CHANGES**  
> The `UrlReflection` service currently partially depends on the language module.
> The next major version will decouple the `UrlReflection` service from the language module. The required refactoring is still unpredicted.

Use this service to reflect on urls and extract their different parts.
This service provides:
1. Methods for quick reflection on any given url.
2. Properties for quick reflection on the currently navigated url.

The service also exposes the regular expressions it uses as public members for manual match-work.

# See Also
[LanguageIntegrationModule](/Modules/LanguageIntegrationModule)

[Implementing integration in a library](/Modules/LanguageIntegrationModule/Implementing-in-a-library)

[Providing integration from an app](/Modules/LanguageIntegrationModule/Providing-from-an-app)
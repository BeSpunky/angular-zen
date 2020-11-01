# UrlLocalizationService
This service reflects on the currently navigated url and gives you the ability to easily localize and delocalize it.
For this service to work, you must provide a localization strategy when calling`LanguageIntegrationModule.forRoot()` using the optional `urlLocalization` property.

## Strategies
A localization strategy tells the localization service where and how the current language is expressed in the url.
The strategy is then transformed into a localizer class which holds the implementation.

There are 3 built-in localizers:
1. `RoutePositionUrlLocalizer` - Instantiated when your strategy is a number.
2. `QueryParamsUrlLocalizer`   - Instantiated when your strategy is a string.
3. `NoopUrlLocalizer`          - Instantiated when no strategy was provided.

You can also set a factory or class provider to implement your own localization strategy.
An example use case would be localization using sub-domains or host replacement for different languages.

See the [`LanguageIntegrationProvider.urlLocalization`](LINK TO CODE) property for complete API and documentation.

# UrlReflection
> **❗ EXPECT CHANGED** The `UrlReflection` service currently partially depends on the language module.
> The next major version will decouple the `UrlReflection` service from the language module. The required refactoring is still unpredicted.

Use this service to reflect on urls and extract their different parts.
This service provides:
1. Methods for quick reflection on any given url.
2. Properties for quick reflection on the currently navigated url.

The service also exposes the regular expressions it uses as public members for manual match-work.
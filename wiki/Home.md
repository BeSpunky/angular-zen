[![Build status](https://dev.azure.com/BeSpunky/Libraries/_apis/build/status/angular-zen/Build%20angular-zen)](https://dev.azure.com/BeSpunky/Libraries/_build/latest?definitionId=29)
![Azure DevOps builds](https://img.shields.io/azure-devops/build/bespunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)
![Azure DevOps tests](https://img.shields.io/azure-devops/tests/BeSpunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)
![Azure DevOps coverage](https://img.shields.io/azure-devops/coverage/BeSpunky/bebdc696-fbbf-4816-9247-9d1311da59bc/29?style=flat-square)

![npm bundle size](https://img.shields.io/bundlephobia/min/@bespunky/angular-zen.svg?style=flat-square)
![npm downloads](https://img.shields.io/npm/dm/@bespunky/angular-zen.svg?style=flat-square)
![npm (scoped)](https://img.shields.io/npm/v/@bespunky/angular-zen.svg?style=flat-square)

<p align="center">
    <img src="https://dev.azure.com/BeSpunky/bebdc696-fbbf-4816-9247-9d1311da59bc/_apis/git/repositories/1f3eb3c0-8f08-46b0-a3bf-f2ea2225a0a5/items?path=%2Fprojects%2Fdemo%2Fsrc%2Fassets%2Flogo%400.75x.png&versionDescriptor%5BversionOptions%5D=0&versionDescriptor%5BversionType%5D=0&versionDescriptor%5Bversion%5D=development&resolveLfs=true&%24format=octetStream&api-version=5.0"/>
</p>

<p align="center" style="font-size: x-large">@bespunky/angular-zen</p>
<p align="center" style="font-size: medium">Angular tools that you always wished were there.</p>

<p align="center" style="font-size: medium; margin: 20px auto">
    ✨ <a href="https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen/131/Getting-Started">Getting Started</a> |
    🙌 <a href="https://bs-angular-zen-demo.web.app/">Live Demo</a> |
    🎁 <a href="https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen/132/Modules">What's in the library?</a>
</p>

You know the feeling... It's late at night and you want to write a class method. Suddenly you find yourself spending hours on some infrastructural piece just so you can start implementing the method. 😪

# 🧘‍♂️ Enter Zen...
`@bespunky/angular-zen` provides a set of well meditated general purpose tools for common Angular related tasks, to help you keep focused on the task at hand and stay in control of your workflow.

These tools are all **🌳 tree-shakable**.

You may use the library as you like, with any app, under the MIT license.

# 📦 The Highlights


| [🔲 `WindowRef`](/Modules/CoreModule/WindowRef) | [📄 `DocumentRef`](/Modules/CoreModule/DocumentRef) | [💥`Destroyable`](/Modules/CoreModule/Destroyable) | [😎 `HeadService`](/Modules/CoreModule/HeadService) |
|:------------------------------------------------:|:----------------------------------------------------:|:---------------------------------------------------:|:----------------------------------------------------:|
| The safe way to access the `window` object.      | The safe way to access the `document` object         | No more manual `unsubscribe()` calls.               | Cleanly access and manipulate the head element.      |


| [⏳ `LazyLoaderService`](/Modules/AsyncModule/LazyLoaderService) | [🌎 `Universal Platform Directives`](/Modules/UniversalModule/Platform-Directives) | [🔗 `LanguageIntegrationService`](/Modules/LanguageIntegrationModule) | [🔍 `UrlReflectionService`](/Modules/LanguageIntegrationModule/Additional-Language-Tools#UrlReflectionService) |
|:----------------------------------------------------------------:|:-----------------------------------------------------------------------------------:|:----------------------------------------------------------------------:|:---------------------------------------------------------------------------------------------------------------:|
| Programmatically load scripts and styles.                        | Prevent element rendering in Universal with directives.                             | Hook your library with your user's language services.                  | Break urls to their parts.                                                                                      |


# Versions
The library was generated using Angular 7 and has been gradually updated and tested up to Angular 10. 
Compatibility with older versions is possible but not guaranteed.

# Issues & Requests
Unfortunately, Azure DevOps doesn't support issue collection. I'm considering moving this repo to GitHub.  
In the meantime, any issues or requests can be sent to [us@bespunky.io](mailto:us@bespunky.io?subject=@bespunky/angular-zen).

# Other Packages by [`@bespunky`](https://www.npmjs.com/~bespunky)
[`@bespunky/angular-google-maps`](https://www.npmjs.com/package/@bespunky/angular-google-maps)

# Coming Soon
🚧 `@bespunky/angular-zen-ux` will help you with simple UX tasks.

🚧 `@bespunky/angular-zen-seo` will help you with metadata and SEO related tasks.

# References
[Source Code](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen)

[NPM Package](https://www.npmjs.com/package/@bespunky/angular-zen)
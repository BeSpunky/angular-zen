## Premise
The language integration module is a shared space for libraries to consume their user's language services.
It sits between the user's app and imported libraries to centralize and standardize the communication with the app's language services.

## The App Provides, Libraries Consume...
A multi-language app will only need to import the language integration module once, and all libraries which support the language integration module will be provided with the language tools.

<center>

![Language Integration Diagram](/.attachments/Integration-diagram.png)

</center>

> **Note** This module is intended for apps that work with a 'live' localization library similar to [`ngx-translate`](https://github.com/ngx-translate/core).  
There might be a way to use it with Angular's i18n engine but no attempt or research have been performed to confirm it. You are welcome to try and give your feedback.

## Next Steps

[Implementing integration in a library](LanguageIntegrationModule/Implementing-in-a-library.html)

[Providing integration from an app](LanguageIntegrationModule/Providing-from-an-app.html)
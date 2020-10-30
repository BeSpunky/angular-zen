# Premise
The language integration module is a shared space for libraries to consume their user's language services.
It sits between the user's app and imported libraries to centralize and standardize the communication with the app's language services.

<center>

![Language Integration Diagram](LanguageIntegrationModule/.attachments/Integration-diagram.png)

</center>

A multi-language app will only need to import the language integration module once, and all libraries libraries which support the language integration module will be provided with the language tools.

> **Note** This module is intended for apps that work with a 'live' localization library similar to [`ngx-translate`](https://github.com/ngx-translate/core).  
There might be a way to use it with Angular's i18n engine but no attempt or research have been performed to confirm it. You are welcome to try and give your feedback.
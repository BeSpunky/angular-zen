import { Example } from '../../../types/example';
import { Topic   } from '../../../types/topic';

export const LanguageIntegrationModuleExamples: Example[] = [
    {
        title      : 'Implementing in a Library',
        description: 'Providing language support for your library users.',
        icon       : 'handyman',
        embedUrl   : 'https://codesandbox.io/embed/language-integration-module-wnc42?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Flibrary1%2Flibrary1.service.ts&theme=dark'
    },
    {
        title      : 'Providing From an App',
        description: 'Integrating your app\'s language tools with supporting libraries.',
        icon       : 'app_settings_alt',
        embedUrl   : 'https://codesandbox.io/embed/language-integration-module-wnc42?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fapp%2Fdemo-app.module.ts&theme=dark'
    },
    {
        title      : 'Localized Route Awareness',
        description: 'Creating route-aware components and services with language support using `LocalizedRouteAware`.',
        icon       : 'alt_route',
        embedUrl   : 'https://codesandbox.io/embed/localized-route-aware-v49o1?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Flibrary2%2Flibrary2.service.ts&theme=dark'
    },
    {
        title      : 'Url Localization',
        description: 'Define a strategy and transform urls to their localized version.',
        icon       : 'http',
        embedUrl   : 'https://codesandbox.io/embed/url-localization-iwt0r?fontsize=14&hidenavigation=0&module=%2Fsrc%2Fapp%2Fdemo%2Fapp%2Furl-localization.ts&theme=dark'
    }
];

export const LanguageIntegrationModuleTopic: Topic = {
    title      : 'Language Integration Module',
    description: 'Standardize and add language support to your libraries.',
    icon       : 'translate',
    examples   : LanguageIntegrationModuleExamples
};

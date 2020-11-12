import { Example } from '../../../types/example';
import { Topic   } from '../../../types/topic';

export const LanguageIntegrationModuleExamples: Example[] = [
    {
        title      : 'LanguageIntegrationService',
        description: 'Accessing your user\'s language services.',
        icon       : 'translate',
        embedUrl   : 'https://codesandbox.io/embed/loading-styles-3mtlg?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark',soon:true
    },
    {
        title      : 'Localized Route Awareness',
        description: 'Creating route-aware components and services with language support.',
        icon       : 'alt_route',
        embedUrl   : 'https://codesandbox.io/embed/loading-scripts-vgf7t?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark', soon: true
    },
    {
        title      : 'Url Localization',
        description: 'Define a strategy and transform urls to their localized version.',
        icon       : 'http',
        embedUrl   : 'https://codesandbox.io/embed/loading-scripts-vgf7t?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark', soon: true
    }
];

export const LanguageIntegrationModuleTopic: Topic = {
    title      : 'Language Integration Module',
    description: 'Standardize and add language support to your libraries.',
    icon       : 'translate',
    examples   : LanguageIntegrationModuleExamples
};

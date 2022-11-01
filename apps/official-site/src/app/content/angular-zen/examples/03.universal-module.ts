import { Example } from '../../../types/example';
import { Topic   } from '../../../types/topic';

export const UniversalModuleExamples: Example[] = [
    {
        title      : 'UniversalService',
        description: 'Easily identify the current platform.',
        icon       : 'public',
        embedUrl   : 'https://codesandbox.io/embed/universal-service-5y1cb?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
    },
    {
        title      : 'Platform Directives',
        description: 'Allow/prevent rendering of elements using special directives',
        icon       : 'star',
        embedUrl   : 'https://codesandbox.io/embed/platform-directives-zg8d9?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.html&theme=dark'
    }
];

export const UniversalModuleTopic: Topic = {
    title      : 'Universal Module',
    description: 'Learn how to identify the current platform and render platform specific elements.',
    icon       : 'public',
    examples   : UniversalModuleExamples
};

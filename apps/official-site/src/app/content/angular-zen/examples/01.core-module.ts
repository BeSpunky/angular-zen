import { Example } from '../../../types/example';
import { Topic   } from '../../../types/topic';

export const CoreModuleExamples: Example[] = [
    {
        title      : 'WindowRef',
        description: 'Safely access or mock the `window` object.',
        icon       : 'desktop_windows',
        embedUrl   : 'https://codesandbox.io/embed/window-ref-cuqht?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
    },
    {
        title      : 'DocumentRef',
        description: 'Safely access or mock the `document` object.',
        icon       : 'description',
        embedUrl   : 'https://codesandbox.io/embed/document-ref-ipur0?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
    },
    {
        title      : 'HeadService',
        description: 'Work with the `<head>` element to create, modify, find and remove elements.',
        icon       : 'face',
        embedUrl   : 'https://codesandbox.io/embed/head-service-l2sqf?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
    },
    {
        title      : 'Destroyable',
        description: 'Subscribe to observables without worrying about memory leaks.',
        icon       : 'local_fire_department',
        embedUrl   : 'https://codesandbox.io/embed/destroyable-tmjni?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fno-leak.component.ts&theme=dark'
    },
    {
        title      : '*observe directives',
        description: 'Enhance the concepts of the `async` pipe with new features.',
        icon       : 'visibility',
        embedUrl   : '',
        soon       : true
    },
    {
        title      : '*onObserver directives',
        description: 'Condition template rendering according to observable states.',
        icon       : 'generating_tokens',
        embedUrl   : '',
        soon       : true
    }
];

export const CoreModuleTopic: Topic = {
    title      : 'Core Module',
    description: 'Learn about the core infrastructural tools.',
    icon       : 'memory',
    examples   : CoreModuleExamples
};

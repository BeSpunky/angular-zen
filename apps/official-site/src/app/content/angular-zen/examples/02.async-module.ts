import { Example } from '../../../types/example';
import { Topic   } from '../../../types/topic';

export const AsyncModuleExamples: Example[] = [
    {
        title      : 'Lazy Loading Styles',
        description: 'Loading styles programatically.',
        icon       : 'style',
        embedUrl   : 'https://codesandbox.io/embed/loading-styles-3mtlg?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
    },
    {
        title      : 'Lazy Loading Scripts',
        description: 'Loading scripts programatically.',
        icon       : 'code',
        embedUrl   : 'https://codesandbox.io/embed/loading-scripts-vgf7t?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
    }
];

export const AsyncModuleTopic: Topic = {
    title      : 'Async Module',
    description: 'Learn about the async operation tools.',
    icon       : 'align_horizontal_left',
    examples   : AsyncModuleExamples
};

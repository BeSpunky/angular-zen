import { Example } from '../../../types/example';
import { Topic   } from '../../../types/topic';

export const RouterXModuleExamples: Example[] = [
    {
        title      : 'RouterOutletComponentBus',
        description: 'Fetching the instances of components activated by the outlets in your app.',
        icon       : 'settings_input_component',
        embedUrl   : 'https://codesandbox.io/embed/router-outlet-component-bus-n32g0?expanddevtools=1&fontsize=14&hidenavigation=0&module=%2Fsrc%2Fapp%2Fdemo%2Fmonitor.service.ts&theme=dark'
    },
    {
        title      : 'Route Awareness',
        description: 'Creating route-aware components and services with ease.',
        icon       : 'alt_route',
        embedUrl   : 'https://codesandbox.io/embed/loading-scripts-vgf7t?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark', soon: true
    },
    {
        title      : 'Url Reflection',
        description: 'Extracting the different parts of the current or any url.',
        icon       : 'http',
        embedUrl   : 'https://codesandbox.io/embed/url-reflection-qhtl4?fontsize=14&hidenavigation=0&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.html&theme=dark'
    }
];

export const RouterXModuleTopic: Topic = {
    title      : 'RouterX Module',
    description: 'Learn new ways if working with routes.',
    icon       : 'alt_route',
    examples   : RouterXModuleExamples
};

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
        title      : 'Route Aware Event Handling',
        description: 'Creating route-aware components and services with ease.',
        icon       : 'flash_on',
        embedUrl   : 'https://codesandbox.io/embed/router-events-rnvw5?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
    },
    {
        title      : 'Route Aware Deep Scan',
        description: 'Performing a deep scan or accumulative actions on a route tree.',
        icon       : 'search',
        embedUrl   : 'https://codesandbox.io/embed/deep-route-scan-6i0uk?expanddevtools=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
    },
    {
        title      : 'Route Aware Resolves',
        description: 'Use route-aware tools to resolve async code at any time.',
        icon       : 'sync_alt',
        embedUrl   : 'https://codesandbox.io/embed/resolves-7e5iq?fontsize=14&hidenavigation=1&module=%2Fsrc%2Fapp%2Fdemo%2Fdemo.component.ts&theme=dark'
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

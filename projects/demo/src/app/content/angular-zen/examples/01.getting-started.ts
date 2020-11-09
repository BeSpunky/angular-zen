import { Example } from '../../../types/example';
import { Topic   } from '../../../types/topic';

export const GettingStartedExamples: Example[] = [
    {
        title      : 'WindowRef',
        description: 'Safely access or mock the `window` object.',
        icon       : 'desktop_windows',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-plug-n-play?embed=1&file=src/app/app.module.ts',
        soon: true
    },
    {
        title      : 'DocumentRef',
        description: 'Safely access or mock the `document` object.',
        icon       : 'description',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-custom-loader?embed=1&file=src/app/app.module.ts',
        soon: true
    },
    {
        title      : 'HeadService',
        description: 'Work with the `<head>` element to create, modify, find and remove elements.',
        icon       : 'face',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-manual-loading?embed=1&file=src/app/app.module.ts',
        soon: true
    },
    {
        title      : 'Destroyable',
        description: 'Subscribe to observables without worrying about memory leaks.',
        icon       : 'local_fire_department',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-manual-loading?embed=1&file=src/app/app.module.ts',
        soon: true
    }
];

export const GettingStartedTopic: Topic = {
    title      : 'Core Module',
    description: 'Learn about the core infrastructural tools.',
    icon       : 'memory',
    examples   : GettingStartedExamples
};

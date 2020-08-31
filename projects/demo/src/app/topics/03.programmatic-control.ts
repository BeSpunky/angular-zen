import { Example } from '../types/example';
import { Topic   } from '../types/topic';

export const ProgrammaticControlExamples: Example[] = [
    {
        title      : 'Wrappers From Events',
        description: 'Relying on events to work with wrappers.',
        icon       : 'flash_on',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-wrappers-from-events?embed=1&file=src/app/map/map.component.ts'
    },
    {
        title      : 'Wrappers From `ViewChild`',
        description: 'Querying the view inside of your component to fetch the wrapper instance.',
        icon       : 'picture_in_picture',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-wrappers-from-viewchild?embed=1&file=src/app/map/map.component.ts'
    },
    {
        title      : 'Wrappers Directly In Template',
        description: 'Creating reference variables and using your wrappers directly in your template.',
        icon       : 'article',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-wrappers-in-template?embed=1&file=src/app/map/map.component.html'
    },
    {
        title      : 'Superpowers',
        description: 'Programmatically fetch superpowers and use them in your components.',
        icon       : 'battery_charging_full',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-programmatic-superpowers?embed=1&file=src/app/map/map.component.ts'
    },
    {
        title      : 'Custom Data',
        description: 'Store custom data along with your different wrapper instances for your needs.',
        icon       : 'move_to_inbox',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-programmatic-custom-data?embed=1&file=src/app/map/map.component.html'
    }
];

export const ProgrammaticControlTopic: Topic = {
    title      : 'Programmatic Control',
    description: 'Different ways of accessing wrappers, controlling the map and its components and storing custom data.',
    icon       : 'code',
    examples   : ProgrammaticControlExamples
};

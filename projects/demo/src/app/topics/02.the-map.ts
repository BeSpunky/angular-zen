import { Example } from '../types/example';
import { Topic } from '../types/topic';

export const TheMapExamples: Example[] = [
    {
        title      : 'Map Options',
        description: 'Set options to your map (e.g. center, zoom, etc.)',
        icon       : 'tune',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-map-options?embed=1&file=src/app/map/map.component.html'
    },
    {
        title      : 'Map Events',
        description: 'Bind event handlers and react to user interactions with the map.',
        icon       : 'flash_on',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-map-events?embed=1&file=src/app/map/map.component.html'
    },
    {
        title      : 'Superpowers (Built-in)',
        description: 'Import superpower modules and enhance your map capabilities with overlays, drawing, object tracking and more).',
        icon       : 'battery_charging_full',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-map-superpowers?embed=1&file=src/app/map/map.component.html'
    },
    {
        title      : 'Extending Superpowers',
        description: 'Implement your own superpower and extend map capabilities.',
        icon       : 'extension',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-extending-superpowers?embed=1&file=src/app/map-analytics-superpower/map-analytics-superpower.ts'
    },
    {
        title      : 'Multiple Maps',
        description: 'Incorporate multiple maps into your app.',
        icon       : 'view_compact',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-map-multiple?embed=1&file=src/app/app.component.html'
    }
];

export const TheMapTopic: Topic = {
    title: 'The Map',
    description: 'Map configuration, event handling and advanced control.',
    icon: 'map',
    examples: TheMapExamples
};

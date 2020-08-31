import { Example } from '../types/example';
import { Topic   } from '../types/topic';

export const OverlaysSuperpowerExamples: Example[] = [
    {
        title      : 'Markers',
        description: 'Add markers (pins) to the map.',
        icon       : 'location_on',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-practices-overlays-superpower?embed=1&file=src/app/continents-map/components/continent-overlays/continent-overlays.component.html'
    },
    {
        title      : 'Polygons',
        description: 'Draw polygons on the map.',
        icon       : 'change_history',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-practices-overlays-superpower?embed=1&file=src/app/continents-map/components/continent-overlays/continent-overlays.component.html'
    },
    {
        title      : 'Data Layer',
        description: 'Load different overlays straight from a GeoJson object, or manually add features.',
        icon       : 'category',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-practices-overlays-superpower?embed=1&file=src/app/continents-data-layer-map/continents-data-layer-map.component.html'
    },
    {
        title      : 'Info Windows',
        description: 'Create a popup with custom info in different positions on the map.',
        icon       : 'chat_bubble',
        embedUrl   : '',
        soon       : true
    },
    {
        title      : 'Overlay Tracking',
        description: 'Use the superpower\'s tracker to get a hold of all overlays you have placed on the map.',
        icon       : 'track_changes',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-practices-overlays-superpower?embed=1&file=src/app/continents-map/continents-map.component.ts'
    }
];

export const OverlaysSuperpowerTopic: Topic = {
    title      : 'Overlays Superpower',
    description: 'Add markers, polygons and other overlays to your map, along with overlay tracking.',
    icon       : 'layers',
    examples   : OverlaysSuperpowerExamples
};

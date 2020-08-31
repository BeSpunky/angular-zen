import { Example } from '../types/example';
import { Topic   } from '../types/topic';

export const GeometryTypesExamples: Example[] = [
    {
        title      : 'Single Coord',
        description: 'Format flexiblity with single coordinates.',
        icon       : 'gps_fixed',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-injectables-geometry?embed=1&file=src/app/demo/coords.ts',
    },
    {
        title      : 'Single Paths',
        description: 'Format flexibility with single paths.',
        icon       : 'timeline',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-injectables-geometry?embed=1&file=src/app/demo/single-paths.ts',
    },
    {
        title      : 'Multi Paths',
        description: 'Format flexibility with multi paths.',
        icon       : 'tonality',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-injectables-geometry?embed=1&file=src/app/demo/multi-paths.ts',
    },
    {
        title      : 'Bounds',
        description: 'Format flexibility with bounds definition.',
        icon       : 'border_style',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-injectables-geometry?embed=1&file=src/app/demo/bounds.ts',
    }
];

export const GeometryTypesTopic: Topic = {
    title      : 'Geometry Types',
    description: 'The different formats and types supported by the library for working with geometry.',
    icon       : 'architecture',
    examples   : GeometryTypesExamples
};

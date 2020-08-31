import { Example } from '../types/example';
import { Topic   } from '../types/topic';

export const BestPracticesExamples: Example[] = [
    {
        title      : 'Feature Maps',
        description: 'Map scalability through a map component.',
        icon       : 'map',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-practices-feature-map?embed=1&file=src/app/app.component.html'
    },
    {
        title      : 'Feature Components',
        description: 'Compose shared map features as a component or directive for as a child to the map.',
        icon       : 'widgets',
        embedUrl   : 'https://stackblitz.com/edit/bs-google-maps-practices-feature-components?embed=1&file=src/app/branch-maps/branch-marker/branch-marker.component.html'
    }
];

export const BestPracticesTopic: Topic = {
    title      : 'Best Practices',
    description: 'Patterns for scalability, order and ease of use with maps.',
    icon       : 'military_tech',
    examples   : BestPracticesExamples
};

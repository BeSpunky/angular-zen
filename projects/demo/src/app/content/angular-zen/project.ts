import { Project   } from '../../types/project';
import { ZenTopics } from './examples/all';

export const ZenBenefits = [
    { title: 'Plug & Play',                emoji: '🔌', description: 'Easy to use. The intuitive library structure and its API provide for maximum power with minimum effort and learning curve.' },
    { title: 'Tree-Shakable',              emoji: '🌳', description: 'Any library module you don\'t use in your app will be excluded from your final bundle.' },
    { title: 'Fastar Scaffolding',         emoji: '🏗', description: 'Create services and components quicker.' },
    { title: 'Worry Less',                 emoji: '🥳', description: 'Well tested infrustructural tools give you deeper control with no need to dive deep yourself.' },
    { title: 'Angular Universal Tools',    emoji: '🌎', description: 'Services and directives facilitate with SSR.' },
    { title: 'Router Extensions',          emoji: '🔀', description: 'Improved routing tools experience.' },
    { title: 'Language Integration Tools', emoji: '🗣', description: 'Quickly add and standardize language support to your libraries.' },
    { title: 'Open-source!',               emoji: '🤩', description: 'Learn how it works! Contribute! Fork it! Make it your own!' }
];

export const ZenCredits = [
    { text: 'Cover image created by pixabay - www.pixabay.com', url: 'https://pixabay.com/photos/buddha-india-mind-prayer-concept-1550588/' }
];

export const ZenProject: Project = {
    name          : 'angular-zen',
    strongName    : 'Angular Zen',
    slogan        : 'The Angular tools you always wished were there.',
    benefitsSlogan: 'Helps you focus on what you really need to do.',
    benefits      : ZenBenefits,
    examplesTopics: ZenTopics,
    linkedProjects: [],
    wikiUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen',
    repoUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen',
    packageUrl    : 'https://www.npmjs.com/package/@bespunky/angular-zen',
    credits       : ZenCredits
};
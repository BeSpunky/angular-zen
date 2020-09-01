import { Project       } from '../../types/project';
import { ZenUxProject  } from '../angular-zen-ux/project';
import { ZenSeoProject } from '../angular-zen-seo/project';
import { ZenTopics     } from './examples/all';

export const ZenBenefits = [
    { title: 'Plug & Play',             emoji: '🔌', description: 'Easy to use. The intuitive library structure and its API provide for maximum power with minimum effort and learning curve.' },
    { title: 'Tree-Shakable',           emoji: '🌳', description: 'Any library module you don\'t use in your app will be excluded from your final bundle.' },
    { title: 'Angular Universal Tools', emoji: '🌎', description: 'Services and directives facilitate with SSR.' },
    { title: 'Open-source!',            emoji: '🤩', description: 'Learn how it works! Contribute! Fork it! Make it your own!' }
];

export const ZenProject: Project = {
    name          : 'angular-zen',
    strongName    : 'Angular Zen',
    slogan        : 'Your default toolbox for Angular.',
    benefitsSlogan: 'Helps you focus on what you really need to do.',
    benefits      : ZenBenefits,
    examplesTopics: ZenTopics,
    linkedProjects: [ZenUxProject, ZenSeoProject],
    wikiUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen',
    repoUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen'
};
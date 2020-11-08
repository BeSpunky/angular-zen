import { Project       } from '../../types/project';
import { ZenProject    } from '../angular-zen/project';
import { ZenSeoProject } from '../angular-zen-seo/project';
import { ZenUxTopics   } from './examples/all';

export const ZenUxBenefits = [
    { title: 'Plug & Play',             emoji: '🔌', description: 'Easy to use. The intuitive library structure and its API provide for maximum power with minimum effort and learning curve.' },
    { title: 'Tree-Shakable',           emoji: '🌳', description: 'Any library module you don\'t use in your app will be excluded from your final bundle.' },
    { title: 'Angular Universal Tools', emoji: '🌎', description: 'Services and directives facilitate with SSR.' },
    { title: 'Open-source!',            emoji: '🤩', description: 'Learn how it works! Contribute! Fork it! Make it your own!' }
];

export const ZenUxProject: Project = {
    name          : 'angular-zen-ux',
    strongName    : 'Angular Zen UX',
    slogan        : 'Your default toolbox for Angular.',
    benefitsSlogan: 'Helps you focus on what you really need to do.',
    benefits      : ZenUxBenefits,
    examplesTopics: ZenUxTopics,
    // linkedProjects: [ZenProject, ZenSeoProject],
    linkedProjects: [],
    wikiUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen-seo',
    repoUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen'
};
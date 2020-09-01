import { Project      } from '../../types/project';
import { ZenProject   } from '../angular-zen/project';
import { ZenUxProject } from '../angular-zen-ux/project';
import { ZenSeoTopics } from './examples/all';

export const ZenSeoBenefits = [
    { title: 'Plug & Play',             emoji: '🔌', description: 'Easy to use. The intuitive library structure and its API provide for maximum power with minimum effort and learning curve.' },
    { title: 'Tree-Shakable',           emoji: '🌳', description: 'Any library module you don\'t use in your app will be excluded from your final bundle.' },
    { title: 'Angular Universal Tools', emoji: '🌎', description: 'Services and directives facilitate with SSR.' },
    { title: 'Open-source!',            emoji: '🤩', description: 'Learn how it works! Contribute! Fork it! Make it your own!' }
];

export const ZenSeoProject: Project = {
    name          : 'angular-zen-seo',
    strongName    : 'Angular Zen SEO',
    slogan        : 'Your default toolbox for Angular.',
    benefitsSlogan: 'Helps you focus on what you really need to do.',
    benefits      : ZenSeoBenefits,
    examplesTopics: ZenSeoTopics,
    // linkedProjects: [ZenProject, ZenUxProject],
    linkedProjects: [],
    wikiUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen-seo',
    repoUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen'
};
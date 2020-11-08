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

export const ZenUxCredits = [
    { text: 'Cover image by Elias Sch. - www.pixabay.com', url: 'https://pixabay.com/users/EliasSch-3372715/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2040340' },
    { text: 'Hand gesture icon made by Kiranshastry - www.flaticon.com', url: 'https://www.flaticon.com/authors/kiranshastry' }
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
    repoUrl       : 'https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen',
    packageUrl    : 'https://www.npmjs.com/package/@bespunky/angular-zen-ux',
    credits       : ZenUxCredits
};
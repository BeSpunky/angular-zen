import { Project     } from '../../types/project';
import { ZenUxTopics } from './examples/all';

export const ZenUxBenefits = [
    { title: 'Plug & Play',             emoji: '🔌', description: 'Easy to use. The intuitive library structure and its API provide for maximum power with minimum effort and learning curve.' },
    { title: 'Tree-Shakable',           emoji: '🌳', description: 'Any library module you don\'t use in your app will be excluded from your final bundle.' },
    { title: 'Angular Universal Ready', emoji: '🌎', description: 'Designed and tested for work with SSR.' },
    { title: 'Open-source!',            emoji: '🤩', description: 'Learn how it works! Contribute! Fork it! Make it your own!' }
];

export const ZenUxCredits = [
    { text: 'Cover image by Elias Sch. - www.pixabay.com', url: 'https://pixabay.com/users/EliasSch-3372715/?utm_source=link-attribution&amp;utm_medium=referral&amp;utm_campaign=image&amp;utm_content=2040340' },
    { text: 'Hand gesture icon made by Kiranshastry - www.flaticon.com', url: 'https://www.flaticon.com/authors/kiranshastry' }
];

export const ZenUxProject: Project = {
    name          : 'angular-zen-ux',
    strongName    : 'Angular Zen UX',
    slogan        : 'UX tools you love loving.',
    benefitsSlogan: 'Enrich your website with easy to use tools.',
    benefits      : ZenUxBenefits,
    examplesTopics: ZenUxTopics,
    linkedProjects: [],
    wikiUrl       : 'https://bs-angular-zen.web.app/docs/zen-ux/index.html',
    repoUrl       : 'https://github.com/BeSpunky/angular-zen/tree/master/projects/bespunky/angular-zen-ux',
    packageUrl    : 'https://www.npmjs.com/package/@bespunky/angular-zen-ux',
    credits       : ZenUxCredits,
    soon          : true
};
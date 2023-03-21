import { Project      } from '../../types/project';
import { ZenSeoTopics } from './examples/all';

export const ZenSeoBenefits = [
    { title: 'Plug & Play',                  emoji: '🔌', description: 'Easy to use. The intuitive library structure and its API provide for maximum power with minimum effort and learning curve.' },
    { title: 'Tree-Shakable',                emoji: '🌳', description: 'Any library module you don\'t use in your app will be excluded from your final bundle.' },
    { title: 'Angular Universal Ready',      emoji: '🌎', description: 'Designed and tested for work with SSR.' },
    { title: 'Well-Known Protocols Support', emoji: '🔰', description: 'Built-in implementation of meta protocols for Facebook, Twitter and OG.' },
    { title: 'Extendable',                   emoji: '🧩', description: 'Allows you to provide additional protocol implementations.' },
    { title: 'Route Integration',            emoji: '🔀', description: 'Allows you to provide per-route configuration directly in your route config.' },
    { title: 'Link Automation',              emoji: '🔗', description: 'Automates tag creation for canonical links, hreflang links and more.' },
    { title: 'Open-source!',                 emoji: '🤩', description: 'Learn how it works! Contribute! Fork it! Make it your own!' }
];

export const ZenSeoCredits = [
    { text: 'Cover image by Aurélien - Wild Spot - www.unsplash.com', url: 'https://unsplash.com/@wildspot?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText' },
    { text: 'Infographic vector created by freepik - www.freepik.com', url: 'https://www.freepik.com/vectors/infographic' }
];

export const ZenSeoProject: Project = {
    name          : 'angular-zen-seo',
    strongName    : 'Angular Zen SEO',
    slogan        : 'Your go-to tools for SEO implementations with Angular.',
    benefitsSlogan: 'Helps you focus on what you really need to do.',
    benefits      : ZenSeoBenefits,
    examplesTopics: ZenSeoTopics,
    linkedProjects: [],
    wikiUrl       : 'https://bs-angular-zen.web.app/docs/zen-seo/index.html',
    repoUrl       : 'https://github.com/BeSpunky/angular-zen/tree/master/projects/bespunky/angular-zen-seo',
    packageUrl    : 'https://www.npmjs.com/package/@bespunky/angular-zen-seo',
    credits       : ZenSeoCredits,
    soon          : true
};
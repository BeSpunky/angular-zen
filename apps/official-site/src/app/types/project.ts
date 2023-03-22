import { Data    } from '@angular/router';
import { Benefit } from '../types/benefit';
import { Credit  } from '../types/credit';
import { Topic   } from './topic';

export interface Project
{
    name          : string;
    strongName    : string;
    slogan        : string;
    benefitsSlogan: string;
    benefits      : Benefit[];
    examplesTopics: Topic[];
    linkedProjects: Project[];
    wikiUrl       : string;
    repoUrl       : string;
    packageUrl    : string;
    credits       : Credit[];
    soon?         : boolean;
}

export function isProject(data: Data): data is Project
{
    const expectedProps: (keyof Project)[] = ['name', 'strongName', 'slogan', 'benefits', 'benefitsSlogan'];

    return expectedProps.every(name => name in data);
}
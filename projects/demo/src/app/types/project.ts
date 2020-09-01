import { Benefit } from '../types/benefit';
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
}
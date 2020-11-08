import { Project       } from '../types/project';
import { ZenProject    } from './angular-zen/project';
import { ZenUxProject  } from './angular-zen-ux/project';
import { ZenSeoProject } from './angular-zen-seo/project';

export const ZenProjects: Project[] = [
    ZenProject,
    ZenUxProject,
    ZenSeoProject
];
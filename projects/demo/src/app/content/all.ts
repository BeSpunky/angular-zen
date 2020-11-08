import { Project       } from '../types/project';
import { ZenProject    } from './angular-zen/project';
import { ZenUxProject  } from './angular-zen-ux/project';
import { ZenSeoProject } from './angular-zen-seo/project';

export const ZenProjects: Project[] = [
    ZenProject,
    ZenUxProject,
    ZenSeoProject
];

// Manually setting linked projects creates circular dependencies between project files.
// Also this saves time in manually going through all the files to modify its linked projects.
function linkProjects()
{
    // For each project, add all other projects as linked projects
    ZenProjects.forEach((project, index) =>
    {
        const linkedProjects = [...ZenProjects]; // Cloned to preserve original array

        linkedProjects.splice(index, 1);

        project.linkedProjects = linkedProjects;

        return linkedProjects;
    });
}

linkProjects();
import { Observable                            } from 'rxjs';
import { map                                   } from 'rxjs/operators';
import { Injectable                            } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { RouteAware                            } from '@bespunky/angular-zen/router-x';

import { isProject, Project } from '../types/project';
import { ZenProject         } from '../content/angular-zen/project';

@Injectable({
    providedIn: 'root'
})
export class ProjectService extends RouteAware
{
    public readonly current: Observable<Project>;

    constructor(router: Router, route: ActivatedRoute)
    {
        super(router, route);

        this.current = this.observeRouterEvent(NavigationEnd).pipe(map(() => this.extractProject()));
    }
        
    private extractProject(): Project
    {
        if (!this.route.snapshot.root.firstChild) return ZenProject;

        let project: Project | undefined;

        this.deepScanRoute(this.route.snapshot.root.firstChild, route =>
        {
            if (!isProject(route.data)) return;

            project = route.data as Project;

            return true;
        }, 1);

        return project ?? ZenProject;
    }
}

import { Component         } from '@angular/core';
import { NavigationEnd     } from '@angular/router';
import { RouteAwareService } from '@bespunky/angular-zen/router-x';

import { isProject, Project } from './types/project';

@Component({
    selector   : 'demo-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent extends RouteAwareService
{
    public project: Project;

    protected onNavigationEnd(event: NavigationEnd): void
    {
        this.extractProject();
    }
    
    private extractProject(): void
    {
        // The root '/' path will have the project as data
        let projectRoute = this.route.snapshot.root.firstChild;
        // If this is not the root path (i.e. this is a specific project route like /angular-zen-ux) dive one level deeper to extract the project
        if (!isProject(projectRoute.data)) projectRoute = projectRoute.firstChild;

        this.project = projectRoute.data as Project;
    }
}

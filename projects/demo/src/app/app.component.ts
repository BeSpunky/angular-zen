import { Observable     } from 'rxjs';
import { tap, filter, map,           } from 'rxjs/operators';
import { Component,     } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';

import { Project } from './types/project';

@Component({
    selector   : 'demo-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    public project$: Observable<Project>;

    constructor(private router: Router, private route: ActivatedRoute)
    {
        this.project$ = this.router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            tap(_ => console.log(route.snapshot)),
            map(_ => this.extractProject(this.route.snapshot))
        );
    }

    private extractProject(route: ActivatedRouteSnapshot): Project
    {
        return Object.keys(route.data).length ? route.data as Project : this.extractProject(route.firstChild);
    }
}

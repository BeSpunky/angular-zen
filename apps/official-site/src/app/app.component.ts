import { Component } from '@angular/core';

import { ProjectService } from './services/project.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    constructor(public project: ProjectService) { }
}

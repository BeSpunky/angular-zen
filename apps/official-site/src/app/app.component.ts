import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { map, take, tap } from 'rxjs/operators';

import { ProjectService } from './services/project.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    public x = interval(1000).pipe(take(10), /* tap(console.log), */ map(i => i));
    public y = interval(1500).pipe(take(20), /* tap(console.log), */ map(i => String.fromCharCode(i + 65)));

    constructor(public project: ProjectService) { }
}

import { Component } from '@angular/core';
import { interval } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { ProjectService } from './services/project.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    public x = interval(1000).pipe(take(10));
    // public x = interval(1000).pipe(take(10), map(i => { if (i === 3) throw new Error('Hate number 3'); return i }));
    public y = interval(2500).pipe(take(5 ), map(i => String.fromCharCode(i + 65)));

    public dododo(v: any): void
    {
        console.log(v);
    }

    constructor(public project: ProjectService) { }
}

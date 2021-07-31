import { timer, Observable, of } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';
import { Component } from '@angular/core';

import { ProjectService } from './services/project.service';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    public x!: Observable<number>;
    public y!: Observable<string>;

    public dododo(v: any): void
    {
        console.log(v);
    }

    public restart()
    {
        this.x = timer(3000, 1000).pipe(take(5));
        this.y = timer(3000, 2300).pipe(take(5), map(i => String.fromCharCode(i + 65)));
    }

    public error()
    {
        this.x = timer(3000, 1000).pipe(take(5), map(i => { if (i === 3) throw new Error('Hate number 3'); return i }));
        this.y = timer(3000, 2500).pipe(take(5), map(i => { if (i === 3) throw new Error('Hate the letter D'); return String.fromCharCode(i + 65) }));
    }

    constructor(public project: ProjectService) { this.restart(); }
}

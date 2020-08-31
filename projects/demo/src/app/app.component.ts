import { Observable                      } from 'rxjs';
import { map, shareReplay                } from 'rxjs/operators';
import { Component                       } from '@angular/core';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';

import { Topics } from './topics/all';

export const WikiUrl: string = 'https://dev.azure.com/BeSpunky/Libraries/_wiki/wikis/angular-zen';
export const RepoUrl: string = 'https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen';

@Component({
    selector   : 'demo-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    public readonly wikiUrl: string = WikiUrl;
    public readonly repoUrl: string = RepoUrl;

    public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
        .pipe(
            map(result => result.matches),
            shareReplay()
        );

    public readonly topics = Topics;

    constructor(private breakpointObserver: BreakpointObserver) { }
}

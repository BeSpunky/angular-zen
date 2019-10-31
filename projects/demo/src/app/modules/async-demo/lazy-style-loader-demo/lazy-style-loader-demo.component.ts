import { Component } from '@angular/core';
import { LazyLoaderService } from '@bespunky/angular-zen';

export const MagicStyleUrl = '/assets/magic.css';

@Component({
    selector: 'zen-lazy-style-loader-demo',
    templateUrl: './lazy-style-loader-demo.component.html',
    styleUrls: ['./lazy-style-loader-demo.component.css']
})
export class LazyStyleLoaderDemoComponent
{
    public loading = false;

    constructor(private loader: LazyLoaderService) { }

    public loadStyle()
    {
        this.loading = true;

        this.loader.loadStyle(MagicStyleUrl).subscribe(_ => this.loading = false);
    }
}

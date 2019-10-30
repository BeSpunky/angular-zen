import { Component, OnInit } from '@angular/core';
import { LazyLoaderService } from '@bespunky/angular-zen';

@Component({
    selector: 'zen-lazy-style-loader-demo',
    templateUrl: './lazy-style-loader-demo.component.html',
    styleUrls: ['./lazy-style-loader-demo.component.css']
})
export class LazyStyleLoaderDemoComponent implements OnInit
{
    public loading = false;

    constructor(private loader: LazyLoaderService) { }

    ngOnInit()
    {
    }

    public loadStyle()
    {
        this.loading = true;

        this.loader.loadStyle('/assets/magic.css').subscribe(_ => this.loading = false);
    }
}

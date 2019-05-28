import { Component, OnInit } from '@angular/core';
import { LazyScriptLoaderService, ScriptLoadOptions } from 'angular-zen';

@Component({
    selector: 'zen-lazy-script-loader-demo',
    templateUrl: './lazy-script-loader-demo.component.html',
    styleUrls: ['./lazy-script-loader-demo.component.css']
})
export class LazyScriptLoaderDemoComponent implements OnInit
{
    public status: string;

    constructor(private loader: LazyScriptLoaderService) { }

    ngOnInit()
    {
        this.load(true);
    }

    public load(overrideCheck: boolean)
    {
        const options: ScriptLoadOptions = {};

        if (overrideCheck) options.alreadyLoaded = () => false; // (window as any).$;

        this.status = 'Loading jQuery script async...';

        this.loader.loadScript('https://code.jquery.com/jquery-3.4.1.min.js', options)
            .subscribe(lazyScript =>
            {
                this.status = 'jQuery script loaded. Check <head> element.';
                console.log(lazyScript.url, lazyScript.completed);
            });
    }
}

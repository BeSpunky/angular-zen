import { Component, OnInit } from '@angular/core';
import { WindowRef } from '@bespunky/angular-zen/core';
import { LazyLoaderService, ScriptLoadOptions } from '@bespunky/angular-zen/async';

@Component({
    selector: 'zen-lazy-script-loader-demo',
    templateUrl: './lazy-script-loader-demo.component.html',
    styleUrls: ['./lazy-script-loader-demo.component.css']
})
export class LazyScriptLoaderDemoComponent implements OnInit
{
    private jQueryCDN = 'https://code.jquery.com/jquery-3.4.1.min.js';

    public status: string;

    constructor(private loader: LazyLoaderService, public windowRef: WindowRef) { }

    ngOnInit()
    {
        this.status = 'N/A';
    }

    private load(options: ScriptLoadOptions = {})
    {
        this.status = 'Loading async...';

        this.loader.loadScript(this.jQueryCDN, options)
                   .subscribe(lazyScript => this.status = 'Loaded. Check <head> element.');
    }

    private alreadyLoaded()
    {
        return !!(this.windowRef.nativeWindow as any).$;
    }

    public loadUsingDefaults()
    {
        this.load();
    }

    public overrideAndLoad()
    {
        this.load({ alreadyLoaded: this.alreadyLoaded.bind(this) });
    }
}

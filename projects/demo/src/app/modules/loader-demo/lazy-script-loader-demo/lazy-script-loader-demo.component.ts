import { Component, OnInit } from '@angular/core';
import { WindowRef } from 'angular-zen';
import { LazyScriptLoaderService, ScriptLoadOptions } from 'angular-zen';
import { load } from '@angular/core/src/render3';

@Component({
    selector: 'zen-lazy-script-loader-demo',
    templateUrl: './lazy-script-loader-demo.component.html',
    styleUrls: ['./lazy-script-loader-demo.component.css']
})
export class LazyScriptLoaderDemoComponent implements OnInit
{
    private jQueryCDN = 'https://code.jquery.com/jquery-3.4.1.min.js';

    public status: string;

    constructor(private loader: LazyScriptLoaderService, public windowRef: WindowRef) { }

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

    public loadUsingDefaults()
    {
        this.load();
    }

    public overrideAndLoad()
    {
        const options = { alreadyLoaded: () => (this.windowRef.nativeWindow as any).$ };

        this.load(options);
    }
}

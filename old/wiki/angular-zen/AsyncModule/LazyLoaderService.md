This service loads a script/style file programmatically, while also keeping track of loaded files to avoid loading them multiple times.

## How to use
1. Import `AsyncModule` into your app:
    ```typescript
    import { NgModule } from '@angular/core';
    import { CommonModule } from '@angular/common';
    import { AsyncModule } from '@bespunky/angular-zen/async';

    import { LoaderDemoComponent } from './loader-demo.component';

    @NgModule({
        declarations: [LoaderDemoComponent, LazyScriptLoaderDemoComponent],
        imports: [
            CommonModule,
            AsyncModule // Include in imports
        ],
        exports: [LoaderDemoComponent]
    })
    export class LoaderDemoModule { }
    ```

2. Inject `LazyLoaderService` into your component/service and call `loadScript()` or `loadStyle()`:
    ```typescript
    import { Component, OnInit } from '@angular/core';
    import { LazyLoaderService } from '@bespunky/angular-zen/async';

    @Component({
        selector: 'zen-lazy-script-loader-demo',
        templateUrl: './lazy-script-loader-demo.component.html',
        styleUrls: ['./lazy-script-loader-demo.component.css']
    })
    export class LazyScriptLoaderDemoComponent implements OnInit
    {
        private jQueryCDN = 'https://code.jquery.com/jquery-3.4.1.min.js';

        public status: string;

        constructor(private loader: LazyLoaderService) { }

        ngOnInit()
        {
            this.status = 'N/A';
        }

        private load()
        {
            this.status = 'Loading async...';

            this.loader.loadScript(this.jQueryCDN, options)
                       .subscribe(lazyScript => this.status = 'Loaded. Check <head> element.');
        }
    }
    ```

## See also
[Service API](/docs/zen/injectables/LazyLoaderService.html)

[Providing options](/docs/zen/interfaces/LoadOptions.html)
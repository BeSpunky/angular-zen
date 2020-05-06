# LazyLoaderService
In some cases it is necessary to load a script/style file programatically instead of predefining it in the html directly.

This service surves that exact purpose, while also keeping track of loaded files to avoid loading them multiple times.

# How to use
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

For more exensive examples, see:
* [Service unit tests](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Fasync%2FLazyLoader%2Flazy-loader.service.spec.ts&version=GBmaster)
* [Async Script Demo component](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen?path=%2Fprojects%2Fdemo%2Fsrc%2Fapp%2Fmodules%2Fasync-demo%2Flazy-script-loader-demo&version=GBmaster)
* [Async Style Demo component](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen?path=%2Fprojects%2Fdemo%2Fsrc%2Fapp%2Fmodules%2Fasync-demo%2Flazy-style-loader-demo&version=GBmaster)

# See also
[Service API](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Fasync%2FLazyLoader%2Flazy-loader.service.ts&version=GBmaster)

[Providing options](LazyLoaderService/Options)
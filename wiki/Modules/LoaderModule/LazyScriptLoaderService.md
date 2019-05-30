# LazyScriptLoaderService
In some cases it is necessary to load a script file programatically instead of predefining it in the html directly.

This service surves that exact purpose, while also keeping track of loaded scripts to avoid loading them multiple times.

# How to use
## 1. Import `LoaderModule` into your app:
```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoaderModule } from '@bespunky/angular-zen';

import { LoaderDemoComponent } from './loader-demo.component';

@NgModule({
    declarations: [LoaderDemoComponent, LazyScriptLoaderDemoComponent],
    imports: [
        CommonModule,
        LoaderModule // Include in imports
    ],
    exports: [LoaderDemoComponent]
})
export class LoaderDemoModule { }

```

## 2. Inject `LazyScriptLoaderService` into your component/service and call `loadScript()`:

```typescript
import { Component, OnInit } from '@angular/core';
import { LazyScriptLoaderService } from '@bespunky/angular-zen';

@Component({
    selector: 'zen-lazy-script-loader-demo',
    templateUrl: './lazy-script-loader-demo.component.html',
    styleUrls: ['./lazy-script-loader-demo.component.css']
})
export class LazyScriptLoaderDemoComponent implements OnInit
{
    private jQueryCDN = 'https://code.jquery.com/jquery-3.4.1.min.js';

    public status: string;

    constructor(private loader: LazyScriptLoaderService) { }

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
* [Service unit tests](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Fsrc%2Flib%2Floader%2FLazyScriptLoader%2Flazy-script-loader.service.spec.ts&version=GBmaster)
* [Demo component](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_git/angular-zen?path=%2Fprojects%2Fdemo%2Fsrc%2Fapp%2Fmodules%2Floader-demo%2Flazy-script-loader-demo&version=GBmaster)

# See also
[Service API](https://dev.azure.com/BeSpunky/BeSpunky%20Libraries/_git/angular-zen?path=%2Fprojects%2Fbespunky%2Fangular-zen%2Fsrc%2Flib%2Floader%2FLazyScriptLoader%2Flazy-script-loader.service.ts&version=GBmaster)

[Providing options](LazyScriptLoaderService/Options)
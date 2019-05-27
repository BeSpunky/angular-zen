# WindowRef Service
The `WindowRef` service acts as an injectable angular wrapper for the javascript `window` object.

`WindowRef` will automatically detect if it is running on a browser platform and will return an empty object otherwise.
This allows DI and unit testing.

# How to use
1. Import `CoreModule` into your app:

   ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    import { CoreModule } from '@bespunky/angular-zen'; // 1. Import module

    import { AppComponent } from './app.component';

    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            CoreModule // 2. Import module in your app
        ],
        providers: [], 
        bootstrap: [AppComponent]
    })
    export class AppModule { }
   ```

2. Inject `WindowRef` in your components and use `.nativeWindow` to access the `window` object:

   ```typescript
    import { Component, OnInit } from '@angular/core';
    import { WindowRef } from 'angular-zen';

    @Component({
        selector: 'zen-window-ref-demo',
        templateUrl: './window-ref-demo.component.html',
        styleUrls: ['./window-ref-demo.component.css']
    })
    export class WindowRefDemoComponent implements OnInit
    {
        public screen: Screen;

        constructor(private windowRef: WindowRef) { }

        ngOnInit()
        {
            this.screen = this.windowRef.nativeWindow.screen;
        }
    }
    ```
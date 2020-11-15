The `window` object is necessary many times when working with the web, and normally we would summon it directly in our code. However, `window` doesn't always exist when working with angular. 

## Why?
Angular serves for many purposes other than web development:
- Mobile development
- Server Side development
- Testing

Basically, this means that our application might be run in different environments, others than the normal browser, hence will not have the `window` object.

## What do we do?

The `WindowRef` service acts as an injectable angular wrapper for the javascript `window` object.

`WindowRef` will automatically detect if it is running on a browser platform and will return an empty object otherwise.
This allows DI and unit testing and prevents "`window` is undefined" on non-browser platforms.

The default implementation for `WindowRef` depends on the `WINDOW` token which provides the actual native object.

This eventually gives you the ability to use the `WindowRef` service in your apps and, when needed, mock or provide a different implementation for the service, the `WINDOW` token, or both.

# How to use
1. Import `CoreModule` into your app:
    ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    import { CoreModule } from '@bespunky/angular-zen/core'; // 1. Import core module

    import { AppComponent } from './app.component';

    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            CoreModule // 2. Include module in your app
        ],
        providers: [], 
        bootstrap: [AppComponent]
    })
    export class AppModule { }
    ```

2. Inject `WindowRef` in your components and use `.nativeWindow` to access the `window` object:
    ```typescript
    import { Component, OnInit } from '@angular/core';
    import { WindowRef } from '@bespunky/angular-zen/core';

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

# See also
[Mocking and replacing implementation](WindowRef/Mocking.html)

[`WindowRef` internals](WindowRef/Internals.html)
# DocumentRef Service
The `document` object is necessary many times when working with the web, and normally we would summon it directly in out code. However, `document` doesn't always exist when working with angular. 

## Why?
Angular serves for many purposes other than web development:
- Mobile development
- Server Side development
- Testing

Basically, this means that our application might be run in different environments, others than the normal browser, hence will not have the `document` object.

## What do we do?

The `DocumentRef` service acts as an injectable angular wrapper for the javascript `document` object.

`DocumentRef` will automatically detect if it is running on a browser platform and will return an empty object otherwise.
This allows DI and unit testing.

The default implementation for `DocumentRef` depends on the `DOCUMENT` token which provides the actual native object.

This eventually gives you the ability to use the `DocumentRef` service in your apps and, when needed, mock or provide a different implementation for the service, the `DOCUMENT` token, or both.

# How to use
## 1. Import `CoreModule` into your app:

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

## 2. Inject `DocumentRef` in your components and use `.nativeDocument` to access the `document` object:

   ```typescript
    import { Component, OnInit } from '@angular/core';
    import { DocumentRef } from 'angular-zen';

    @Component({
        selector: 'zen-document-ref-demo',
        templateUrl: './document-ref-demo.component.html',
        styleUrls: ['./document-ref-demo.component.css']
    })
    export class DocumentRefDemoComponent implements OnInit
    {
        public title: string;

        constructor(private documentRef: DocumentRef) { }

        ngOnInit()
        {
            this.title = this.documentRef.nativeDocument.title;
        }
    }
    ```

    # See also
    [Mocking and replacing implementation](DocumentRef/Mocking)

    [`DocumentRef` internals](DocumentRef/Internals)
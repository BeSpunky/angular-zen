# DocumentRef Service
The `DocumentRef` service acts as an injectable angular wrapper for the javascript `document` object.

`DocumentRef` will automatically detect if it is running on a browser platform and will return an empty object otherwise.
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

2. Inject `DocumentRef` in your components and use `.nativeDocument` to access the `document` object:

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
        public screen: Screen;

        constructor(private documentRef: DocumentRef) { }

        ngOnInit()
        {
            this.screen = this.documentRef.nativeDocument.screen;
        }
    }
    ```
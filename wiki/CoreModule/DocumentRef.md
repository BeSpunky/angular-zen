> **TLDR Summary**  
> Use `DocumentRef` to **safely** access the `document` object and/or mock it with a simple to use class and syntax.

The `document` object is necessary many times when working with the web, and normally we would summon it directly in out code. However, `document` doesn't always exist when working with angular. 

## Why?
Angular serves for many purposes other than web development:
- Mobile development
- Server Side development
- Testing

Basically, this means that our application might be run in different environments, others than the normal browser, hence will not have the `document` object.

### What's about angular's `DOCUMENT` token?
Angular's `DOCUMENT` token will actually, depending on the platform, provide the correct DOM Adapter.

Drawbacks:
1. You have to use the `@Inject(DOCUMENT)` syntax. Personally, I hate it. 😒
2. The `DOCUMENT` token is used internally by angular, meaning attempts to mock and replace it directly might break your app/spec. 🤦‍♂️

### What do we do?
The `DocumentRef` service acts as an injectable angular wrapper for the javascript `document` object. By default, `DocumentRef` will use angular's implementation to provide the native document, but you can always mock and provide another implementation.

This eventually gives you the ability to use the `DocumentRef` service in your apps and, when needed, mock or provide a different implementation for the service, the `DOCUMENT` token, or both.

## How to use
### 1. Import `CoreModule` into your app:

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { CoreModule } from '@bespunky/angular-zen/core'; // 1. Import module

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

### 2. Inject `DocumentRef` in your components and use `.nativeDocument` to access the `document` object:

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

## See also
[Mocking and replacing implementation](DocumentRef/Mocking.html)

[`DocumentRef` internals](DocumentRef/Internals.html)
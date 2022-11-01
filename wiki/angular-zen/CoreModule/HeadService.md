Apart from the `Meta` and `Title` services, Angular doesn't provide a straight forward way of manipulating the `<head>` element.

The `HeadService` provides tools for elements lookup, adding elements and removing them from `<head>`.

> If you're looking for a way to lazy load a script or a style, see [`LazyLoaderService`](../asyncmodule/lazyloaderservice.html) instead.

## How to use
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

2. Inject `HeadService` in your components/services and call its methods as needed:
    ```typescript
    import { Component, OnInit } from '@angular/core';
    import { HeadService } from '@bespunky/angular-zen/core';

    @Component({
        selector   : 'zen-head-service-demo',
        templateUrl: './head-service-demo.component.html',
        styleUrls  : ['./head-service-demo.component.css']
    })
    export class HeadServiceDemoComponent implements OnInit
    {
        constructor(private head: HeadService) { }

        ngOnInit()
        {
            this.head.addLinkElement('canonical', { href: 'https://your.canonical.url' });
        }
    }
    ```

## Configuring Elements
When adding elements, you can provide an element configurator. The configurator is either an object or a function.

### Configurator objects
A configurator object is an `{ [attribute]: value }` object. After element creation, each attribute in the object will be written to the element before it is added to the DOM.

### Configurator functions
A configurator function is a `(element) => void` function. After element creation, the native element will be passed into your function so you have a chance at manipulating it before adding it to the DOM.

## Finding/Removing Elements
The `findElements()` and `removeElements()` methods both use the same mechanism for element lookup:
Tag name + any additional attributes you provide.
Lookup is done using `AND` comparisons, meaning all provided arguments must match exactly for the element to be grabbed.

> **Tip** Specifying the wildcard `'**'` as an attribute value will match elements with marked with the attribute, regardless of the attributes value.
> Example:
> ```typescript
> // Finds all <link> elements with an `hreflang` attribute
> head.findElements('link', { hreflang: '**' })
> 
> // <link rel="alternate" hreflang="en"/> Matched
> // <link rel="alternate" hreflang="fr"/> Matched
> // <link rel="alternate" media="only screen and (max-width: 640px)"/> Not Matched
> ```


## Mocking
The service uses the [`DocumentRef`](documentref.html) service internally. If you need to mock the document object or any of its children see [mocking DOCUMENT](documentref/mocking.html).

## See also
[`LazyLoaderService`](../asyncmodule/lazyloaderservice.html)
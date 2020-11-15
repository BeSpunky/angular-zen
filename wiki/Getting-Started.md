To start using the tools provided by the library:

1. Install the npm package:
   
   `> npm install @bespunky/angular-zen`

2. Include the module you need in your corresponding app/feature module:
   
   ```typescript
    import { BrowserModule } from '@angular/platform-browser';
    import { NgModule } from '@angular/core';

    import { AsyncModule } from '@bespunky/angular-zen/async'; // 1. Import module

    import { AppComponent } from './app.component';

    @NgModule({
        declarations: [
            AppComponent
        ],
        imports: [
            BrowserModule,
            AsyncModule // 2. Include module in your app
        ],
        providers: [], 
        bootstrap: [AppComponent]
    })
    export class AppModule { }
   ```

# Next Steps

| Topic              | Description                                            |
|--------------------|--------------------------------------------------------|
| [Modules-Overview](Modules-Overview.html) | A list of the library's modules and their purpose. |
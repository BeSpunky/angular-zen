# The Module
Once your app implements its language solution, you can provide language services to supporting libraries by importing `LanguageIntegrationModule`.

The module should be imported only once, in your app root, using the `forRoot()` method, like so:

```typescript
import { BrowserModule             } from '@angular/platform-browser';
import { NgModule                  } from '@angular/core';
import { LanguageIntegrationModule } from '@bespunky/angular-zen/language'; // <-- Import module

import { AppComponent } from './app.component';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        LanguageIntegrationModule.forRoot(/* ... config */) // <-- Add to app
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
```

# Configuring language integration
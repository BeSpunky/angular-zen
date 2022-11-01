When working with Angular Universal and doing Server Side Rendering, different dificulties always force us to check what platform we are running on and avoid executing certain parts of our code.

`UniversalService` simplifies platform detection code and boostrapping:
```typescript
import { Component        } from '@angular/core';
import { UniversalService } from '@bespunky/angular-zen/universal';

@Component({...})
export class CoolComponent
{ 
    constructor(private universal: UniversalService) { }

    doPlatformSpecificTask()
    {  
        if (this.universal.isPlatformBrowser)
        {
            // Run browser-only code
        }
        
        // Or...
        this.universal.onBrowser(() => /* Run browser-only code */);
    }
}
```

## Conditional Platform Dependent Execution
Use the `onXXX()` methods to condition execution of a section of your code to a specific platform.

## `TLDR` Why the service?
Before `@bespunky/angular-zen`, the way to check what platform the app is running on was to inject `PLATFORM_ID` and pass it to the `isPlatformXXX()` function:

```typescript
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser              } from '@angular/common';

@Component({...})
export class CoolComponent
{ 
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    doPlatformSpecificTask()
    {  
        if (isPlatformBrowser(this.platformId))
        {
            // Run browser-only code
        }
    }
}
```

I've always found this to be tedious to write and frustrating to read.
`UniversalService` wraps the old syntax and provides a simpler and cleaner way.

## Other considerations
* The service also provides the same functionality for server/worker app/worker ui platforms.
* The service is now scaleable and extendable.

## See Also
[Platform Directives](platform-directives.html)
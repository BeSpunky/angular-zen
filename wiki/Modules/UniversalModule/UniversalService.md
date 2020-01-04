# UniversalService
When working with Angular Universal and doing Server Side Rendering, different dificulties always force us to check what platform we are running on and avoid executing certain parts of our code.

Currently, the way to check it in Angular is to inject `PLATFORM_ID` and pass it to the `isPlatformXXX()` function, like so:

```typescript
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({...})
export class CoolComponent implements OnInit
{ 
    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    ngOnInit()
    {  
        if (isPlatformBrowser(this.platformId))
        {
            // Run browser-only code
        }
    }
}
```

Three imports every time (i.e. `Inject`, `PLATFORM_ID` and `isPlatformBrowser`)?? **and** a dirty code?? I've always found this to be tedious to write and annoying to work with. This is where the `UniversalService` comes in...

## The Service
`UniversalService` simply wraps the above syntax and simplifies its use. So instead of the above, we now have:

```typescript
import { Component } from '@angular/core';
import { UniversalService } from '@bespunky/angular-zen';

@Component({...})
export class CoolComponent implements OnInit
{ 
    constructor(private universal: UniversalService) { }

    ngOnInit()
    {  
        if (this.universal.isPlatformBrowser)
        {
            // Run browser-only code
        }
    }
}
```

## Other considerations
* The service also provides the same functionality for server/worker app/worker ui platforms.
* The service is now scaleable and extendable.

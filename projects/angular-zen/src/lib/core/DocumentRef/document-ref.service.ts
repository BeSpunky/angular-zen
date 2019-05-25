import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DocumentRef
{
    constructor(@Inject(PLATFORM_ID) private readonly platformId: any) { }

    get nativeDocument(): any
    {
        return isPlatformBrowser(this.platformId) ? document : new Object();
    }
}

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class WindowRef
{
    constructor(@Inject(PLATFORM_ID) private readonly platformId: any) { }

    get nativeWindow(): any
    {
        return isPlatformBrowser(this.platformId) ? window : new Object();
    }
}

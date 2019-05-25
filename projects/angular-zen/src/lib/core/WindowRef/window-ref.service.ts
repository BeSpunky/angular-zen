import { Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class WindowRef
{
    get nativeWindow(): any
    {
        return isPlatformBrowser(PLATFORM_ID) ? window : new Object();
    }
}

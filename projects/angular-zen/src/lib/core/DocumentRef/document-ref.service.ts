import { Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class DocumentRef
{
    get nativeDocument(): any
    {
        return isPlatformBrowser(PLATFORM_ID) ? document : new Object();
    }
}

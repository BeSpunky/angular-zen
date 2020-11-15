import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformWorkerApp, isPlatformWorkerUi, isPlatformServer } from '@angular/common';

/**
 * Provides quick access to platform information.
 *
 * @export
 * @class UniversalService
 */
@Injectable({
    providedIn: 'root'
})
export class UniversalService
{
    /**
     * `true` if the app is currently running on a browser; otherwise `false`.
     */
    public readonly isPlatformBrowser: boolean;
     /**
     * `true` if the app is currently running on a server; otherwise `false`.
     */
    public readonly isPlatformServer: boolean;
     /**
     * `true` if the app is currently running on a worker app; otherwise `false`.
     */
    public readonly isPlatformWorkerApp: boolean;
     /**
     * `true` if the app is currently running on a worker UI; otherwise `false`.
     */
    public readonly isPlatformWorkerUi: boolean;

    /**
     * Creates an instance of UniversalService.
     * 
     * @param {*} platformId The id of the current platform. This always equals to `PLATFORM_ID`.
     */
    constructor(@Inject(PLATFORM_ID) public readonly platformId: any)
    {
        this.isPlatformBrowser   = isPlatformBrowser(this.platformId);
        this.isPlatformServer    = isPlatformServer(this.platformId);
        this.isPlatformWorkerApp = isPlatformWorkerApp(this.platformId);
        this.isPlatformWorkerUi  = isPlatformWorkerUi(this.platformId);
    }
}

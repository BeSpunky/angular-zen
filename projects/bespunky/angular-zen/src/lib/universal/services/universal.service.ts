import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser, isPlatformWorkerApp, isPlatformWorkerUi, isPlatformServer } from '@angular/common';

@Injectable()
export class UniversalService
{
    /**
     * `true` if the app is currently running on a browser; otherwise `false`.
     */
    public isPlatformBrowser: boolean;
     /**
     * `true` if the app is currently running on a server; otherwise `false`.
     */
    public isPlatformServer: boolean;
     /**
     * `true` if the app is currently running on a worker app; otherwise `false`.
     */
    public isPlatformWorkerApp: boolean;
     /**
     * `true` if the app is currently running on a worker UI; otherwise `false`.
     */
    public isPlatformWorkerUi: boolean;

    constructor(@Inject(PLATFORM_ID) public platformId: any)
    {
        this.isPlatformBrowser   = isPlatformBrowser(this.platformId);
        this.isPlatformServer    = isPlatformServer(this.platformId);
        this.isPlatformWorkerApp = isPlatformWorkerApp(this.platformId);
        this.isPlatformWorkerUi  = isPlatformWorkerUi(this.platformId);
    }
}

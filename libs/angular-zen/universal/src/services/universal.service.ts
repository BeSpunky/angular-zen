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

    /**
     * Executes the specified function only on browser platfroms.
     *
     * @template T The type of value returned by the `execute()` function.
     * @param {() => T} execute The function to execute only on browser platforms.
     * @returns {T} The value returned by the `execute()` function. If the funtion was not executed, this will be `undefined`.
     */
    public onBrowser<T>(execute: () => T): T | undefined
    {
        return this.onPlatform(this.isPlatformBrowser, execute);
    }
    
    /**
     * Executes the specified function only on server platfroms.
     *
     * @template T The type of value returned by the `execute()` function.
     * @param {() => T} execute The function to execute only on server platforms.
     * @returns {T} The value returned by the `execute()` function. If the funtion was not executed, this will be `undefined`.
     */
    public onServer<T>(execute: () => T): T | undefined
    {
        return this.onPlatform(this.isPlatformServer, execute);
    }
    
    /**
     * Executes the specified function only on worker app platfroms.
     *
     * @template T The type of value returned by the `execute()` function.
     * @param {() => T} execute The function to execute only on worker app platforms.
     * @returns {T} The value returned by the `execute()` function. If the funtion was not executed, this will be `undefined`.
     */
    
    public onWorkerApp<T>(execute: () => T): T | undefined
    {
        return this.onPlatform(this.isPlatformWorkerApp, execute);
    }
        
    /**
     * Executes the specified function only on worker UI platfroms.
     *
     * @template T The type of value returned by the `execute()` function.
     * @param {() => T} execute The function to execute only on worker UI platforms.
     * @returns {T} The value returned by the `execute()` function. If the funtion was not executed, this will be `undefined`.
     */
    public onWorkerUi<T>(execute: () => T): T | undefined
    {
        return this.onPlatform(this.isPlatformWorkerUi, execute);
    }

    /**
     * Executes the specified function only on browser platfroms.
     *
     * @template T The type of value returned by the `execute()` function.
     * @param {() => T} execute The function to execute only on browser platforms.
     * @returns {T} The value returned by the `execute()` function. If the funtion was not executed, this will be `undefined`.
     */
    public onNonBrowser<T>(execute: () => T): T | undefined
    {
        return this.onPlatform(!this.isPlatformBrowser, execute);
    }
    
    /**
     * Executes the specified function only on server platfroms.
     *
     * @template T The type of value returned by the `execute()` function.
     * @param {() => T} execute The function to execute only on server platforms.
     * @returns {T} The value returned by the `execute()` function. If the funtion was not executed, this will be `undefined`.
     */
    public onNonServer<T>(execute: () => T): T | undefined
    {
        return this.onPlatform(!this.isPlatformServer, execute);
    }
    
    /**
     * Executes the specified function only on worker app platfroms.
     *
     * @template T The type of value returned by the `execute()` function.
     * @param {() => T} execute The function to execute only on worker app platforms.
     * @returns {T} The value returned by the `execute()` function. If the funtion was not executed, this will be `undefined`.
     */
    
    public onNonWorkerApp<T>(execute: () => T): T | undefined
    {
        return this.onPlatform(!this.isPlatformWorkerApp, execute);
    }
        
    /**
     * Executes the specified function only on worker UI platfroms.
     *
     * @template T The type of value returned by the `execute()` function.
     * @param {() => T} execute The function to execute only on worker UI platforms.
     * @returns {T} The value returned by the `execute()` function. If the funtion was not executed, this will be `undefined`.
     */
    public onNonWorkerUi<T>(execute: () => T): T | undefined
    {
        return this.onPlatform(!this.isPlatformWorkerUi, execute);
    }
    
    private onPlatform<T>(isPlatform: boolean, execute: () => T): T | undefined
    {
        return isPlatform ? execute() : undefined;
    }
}

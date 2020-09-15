import { InjectionToken, PLATFORM_ID, FactoryProvider, Inject, Injectable } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * An injectable token that will allow us to replace the provider for the native window object when necessary (e.g. mocking the `window` object).
 */
export const WINDOW = new InjectionToken<Window>('WindowToken');

/**
 * Provides an injectable wrapper for the `window` object.
 *
 * Inject this in your services/components and you will be able to easily mock or spy on the native `window` object in your tests.
 * You can replace the default `WINDOW` token provider, which allows you to mock the `window` object.
 *
 * @see window-ref.service.spec.ts for examples.
 */
@Injectable({ providedIn: 'root' })
export class WindowRef
{
    // Treating native window as `any` save users typecasting everytime and deducing if the object is of type `Window` or `object`.
    constructor(@Inject(WINDOW) private native: any) { }
    
    get nativeWindow(): any
    {
        return this.native;
    }
}

/**
 * Provides a platform dependant implementation for retrieving the `window` object.
 *
 * @returns `window` for browser platforms and a new object for non-browser platforms.
 */
export function windowFactory(platformId: any): Window | Object
{
    return isPlatformBrowser(platformId) ? window : new Object();
}

/**
 * The default provider for the `WINDOW` token. Provides `window` for browser platforms and a new object for non-browser platforms.
 */
export const WindowProvider: FactoryProvider = {
    provide: WINDOW,
    useFactory: windowFactory,
    deps: [PLATFORM_ID]
};

/**
 * A bundle of all providers needed for WindowRef to work.
 */
export const WindowRefProviders = [WindowProvider];

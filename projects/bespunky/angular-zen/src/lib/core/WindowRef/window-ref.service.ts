import { Injectable, Inject, InjectionToken, PLATFORM_ID, ValueProvider, ClassProvider } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * An injectable token that will allow us to replace the provider for the native window object when necessary (e.g. mocking the `window` object).
 */
export const WINDOW = new InjectionToken<Window>('WindowToken');

/**
 * Provides an injectable wrapper for the `window` object.
 *
 * Inject this in your services/components and you will be able to easily mock or spy on the native `window` object in your tests.
 * You can:
 * - Replace the default `WINDOW` token provider, which allows you to mock the `window` object.
 * - Replace the default `WindowRef` service provider, which allows you to replace the logic for retrieving the `window` object.
 *
 * The default implementation provider for this service is defined by `DefaultWindowRefProvider`.
 *
 * @example
 * @see window-ref.service.spec.ts for examples.
 *
 * @export
 */
@Injectable({
    providedIn: 'root'
})
export class WindowRef
{
    constructor() { }

    get nativeWindow(): any
    {
        throw new Error('Not implemented. Either use `DefaultWindowRefProvider` or extend `WindowRef` and provide your own implementation.');
    }
}

/**
 * Provides a platform dependant implementation for retrieving the native `window` object.
 * For browser platforms, `nativeWindow` will return the native `window` object.
 * For non-browser platforms, `nativeWindow` will return an empty object.
 *
 * This is the default implmentation provider for the `WindowRef` class.
 * @see `DefaultWindowRefProvider`
 *
 * @export
 */
@Injectable({
    providedIn: 'root'
})
export class PlatformDependantWindowRef extends WindowRef
{
    constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(WINDOW) private window: any)
    {
        super();
    }

    get nativeWindow(): any
    {
        return isPlatformBrowser(this.platformId) ? this.window : new Object();
    }
}

/**
 * The default provider for the `WINDOW` token.
 * By default, provides the native `window` object.
 */
export const DefaultWindowProvider: ValueProvider = {
    provide: WINDOW,
    useValue: window
};

/**
 * The default `WindowRef` provider.
 * By default provides the platform dependant implementation.
 */
export const DefaultWindowRefProvider: ClassProvider = {
    provide: WindowRef,
    useClass: PlatformDependantWindowRef
};

export const WindowRefProviders = [DefaultWindowProvider, DefaultWindowRefProvider];

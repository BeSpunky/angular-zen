import { InjectionToken, PLATFORM_ID, FactoryProvider, Inject, Injectable } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/**
 * An injectable token that will allow us to replace the provider for the native document object when necessary (e.g. mocking the `document` object).
 */
// export const DOCUMENT = new InjectionToken<Document>('DocumentToken');

/**
 * Provides an injectable wrapper for the `document` object.
 *
 * Inject this in your services/components and you will be able to easily mock or spy on the native `document` object in your tests.
 * You can replace the default `DOCUMENT` token provider, which allows you to mock the `document` object.
 *
 * @see document-ref.service.spec.ts for examples.
 */
@Injectable({ providedIn: 'root' })
export class DocumentRef
{
    // Treating native document as `any` save users typecasting everytime and deducing if the object is of type `Document` or `object`.
    constructor(@Inject(DOCUMENT) private native: any) { }
    
    get nativeDocument(): any
    {
        return this.native;
    }
}

/**
 * Provides a platform dependant implementation for retrieving the `document` object.
 *
 * @returns `document` for browser platforms and a new object for non-browser platforms.
 */
export function documentFactory(platformId: any): Document | Object
{
    return isPlatformBrowser(platformId) ? document : new Object();
}

/**
 * The default provider for the `DOCUMENT` token. Provides `document` for browser platforms and a new object for non-browser platforms.
 */
export const DocumentProvider: FactoryProvider = {
    provide: DOCUMENT,
    useFactory: documentFactory,
    deps: [PLATFORM_ID]
};

/**
 * A bundle of all providers needed for DocumentRef to work.
 */
export const DocumentRefProviders = [DocumentProvider];

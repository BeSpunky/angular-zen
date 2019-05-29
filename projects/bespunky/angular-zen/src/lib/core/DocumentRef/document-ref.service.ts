import { Injectable, Inject, InjectionToken, PLATFORM_ID, ValueProvider, ClassProvider } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * An injectable token that will allow us to replace the provider for the native document object when necessary (e.g. mocking the `document` object).
 */
export const DOCUMENT = new InjectionToken<any>('DocumentToken');

/**
 * Provides an injectable wrapper for the `document` object.
 *
 * Inject this in your services/components and you will be able to easily mock or spy on the native `document` object in your tests.
 * You can:
 * - Replace the default `DOCUMENT` token provider, which allows you to mock the `document` object.
 * - Replace the default `DocumentRef` service provider, which allows you to replace the logic for retrieving the `document` object.
 *
 * The default implementation provider for this service is defined by `DefaultDocumentRefProvider`.
 * @see document-ref.service.spec.ts for examples.
 * @export
 */
@Injectable({
    providedIn: 'root'
})
export class DocumentRef
{
    constructor() { }

    get nativeDocument(): any
    {
        throw new Error('Not implemented. Either use `DefaultDocumentRefProvider` or extend `DocumentRef` and provide your own implementation.');
    }
}

/**
 * Provides a platform dependant implementation for retrieving the native `document` object.
 * For browser platforms, `nativeDocument` will return the native `document` object.
 * For non-browser platforms, `nativeDocument` will return an empty object.
 *
 * This is the default implmentation provider for the `DocumentRef` class.
 * @see `DefaultDocumentRefProvider`
 *
 * @export
 */
@Injectable({
    providedIn: 'root'
})
export class PlatformDependantDocumentRef extends DocumentRef
{
    constructor(@Inject(PLATFORM_ID) private platformId: any, @Inject(DOCUMENT) private document: any)
    {
        super();
    }

    get nativeDocument(): any
    {
        return isPlatformBrowser(this.platformId) ? this.document : new Object();
    }
}

/**
 * The default provider for the `DOCUMENT` token.
 * By default, provides the native `document` object.
 */
export const DefaultDocumentProvider: ValueProvider = {
    provide: DOCUMENT,
    useValue: document
};

/**
 * The default `DocumentRef` provider.
 * By default provides the platform dependant implementation.
 */
export const DefaultDocumentRefProvider: ClassProvider = {
    provide: DocumentRef,
    useClass: PlatformDependantDocumentRef
};

export const DocumentRefProviders = [DefaultDocumentProvider, DefaultDocumentRefProvider];

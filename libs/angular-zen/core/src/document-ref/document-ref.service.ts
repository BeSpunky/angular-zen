import { ExistingProvider, Inject, Injectable, InjectionToken } from '@angular/core';
import { DOCUMENT as ANGULAR_DOCUMENT                         } from '@angular/common';

/** A token used to provide the native document implementation for `DocumentRef`. By default, `CoreModule` will provide angular's DOCUMENT token. */
export const DOCUMENT = new InjectionToken<Document>('DocumentToken');

/**
 * Provides an injectable wrapper for the `document` object.
 * Inject this in your services/components and you will be able to easily mock or spy on the native `document` object in your tests.
 * 
 * By default, the `nativeDocument` property will point to angular's DOM adapter, thus facilitating DOM access and manipulation
 * on the different platforms.
 * To mock the native document, provide a value for the `DOCUMENT` token from `@bespunky/angular-zen/core`.
 * You will safely mock it without trashing angular's `DOCUMENT` provider.
 * 
 * @see document-ref.service.spec.ts for examples.
 */
@Injectable({ providedIn: 'root' })
export class DocumentRef
{
    // Treating native document as `any` save users typecasting everytime and deducing if the object is of type `Document` or `object`.
    /**
     * Creates an instance of `DocumentRef`.
     * 
     * @param {*} nativeDocument The native document provided by the `DOCUMENT` token of `@bespunky/angular-zen/core`. See `DocumentRef` for details. 
     */
    constructor(@Inject(DOCUMENT) public readonly nativeDocument: any) { }
}

/**
 * The default provider for the `DOCUMENT` token. Uses angular's DOM adapters which will be injected according to the platform.
 */
export const DocumentProvider: ExistingProvider = {
    provide    : DOCUMENT,
    useExisting: ANGULAR_DOCUMENT
};

/**
 * A bundle of all providers needed for DocumentRef to work.
 */
export const DocumentRefProviders = [DocumentProvider];

import { Inject, Injectable } from '@angular/core';
import { DOCUMENT           } from '@angular/common';

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
    constructor(@Inject(DOCUMENT) public readonly nativeDocument: any) { }
}
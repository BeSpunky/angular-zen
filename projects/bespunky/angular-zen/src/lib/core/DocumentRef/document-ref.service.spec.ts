import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { DOCUMENT, DocumentRef, DefaultDocumentRefProvider } from './document-ref.service';

// These are not exported by angular so they are redefined here
const PLATFORM_BROWSER_ID = 'browser';
const PLATFORM_SERVER_ID = 'server';
const PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
const PLATFORM_WORKER_UI_ID = 'browserWorkerUi';

describe('DocumentRef', () =>
{
    const urlStub = 'angular-zen demo';

    let documentMock: any;
    let service: DocumentRef;

    beforeEach(() =>
    {
        documentMock = {
            URL: urlStub
        };
    });

    describe('basically', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    DefaultDocumentRefProvider,
                    { provide: DOCUMENT, useValue: documentMock }
                ]
            });

            service = TestBed.get(DocumentRef);
        });

        it('should be created', () =>
        {
            expect(service).toBeTruthy();
        });

        it('should allow access to the `document` object', () =>
        {
            expect(typeof service.nativeDocument).toBe('object');
        });
    });

    describe('running on browser platforms', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    DefaultDocumentRefProvider,
                    { provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID },
                    { provide: DOCUMENT, useValue: documentMock }
                ]
            });

            service = TestBed.get(DocumentRef);
        });

        it('should return the `document` object', () =>
        {
            expect(service.nativeDocument).toEqual(documentMock);
        });
    });

    describe('running on non-browser platforms', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    DefaultDocumentRefProvider,
                    { provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID },
                    { provide: DOCUMENT, useValue: documentMock }
                ]
            });

            service = TestBed.get(DocumentRef);
        });

        it('should return an empty object', () =>
        {
            expect(service.nativeDocument).not.toEqual(documentMock);
            expect(service.nativeDocument).not.toContain('URL');
        });
    });
});

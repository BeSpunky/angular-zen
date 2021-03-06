import { TestBed                      } from '@angular/core/testing';
import { PLATFORM_ID                  } from '@angular/core';
import { DOCUMENT as ANGULAR_DOCUMENT } from '@angular/common';

import { CoreModule            } from '../core.module';
import { DocumentRef, DOCUMENT } from './document-ref.service';

// These are not exported by angular so they are redefined here
const PLATFORM_BROWSER_ID    = 'browser';
const PLATFORM_SERVER_ID     = 'server';
const PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
const PLATFORM_WORKER_UI_ID  = 'browserWorkerUi';

describe('DocumentRef', () =>
{
    let service: DocumentRef;

    describe('basically', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({imports: [CoreModule]});

            service = TestBed.inject(DocumentRef);
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
        let doc: Document;
        
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                imports  : [CoreModule],
                providers: [
                    { provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID }
                ]
            });

            service = TestBed.inject(DocumentRef);
            doc     = TestBed.inject(ANGULAR_DOCUMENT);
        });

        it('should return the `document` object', () =>
        {
            expect(service.nativeDocument.body).toBeDefined();
        });

        it('should return angular\'s dom adapter object', () =>
        {
            expect(service.nativeDocument).toBe(doc);
        });
    });

    describe('running on non-browser platforms', () =>
    {
        let doc: Document;

        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                imports  : [CoreModule],
                providers: [
                    { provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID }
                ]
            });

            service = TestBed.inject(DocumentRef);
            doc     = TestBed.inject(ANGULAR_DOCUMENT);
        });

        it('should return angular\'s dom adapter object', () =>
        {
            expect(service.nativeDocument).toBe(doc);
        });
    });

    describe('mocking DOCUMENT', () =>
    {
        let mockDocument = { dummy: 'value' };

        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                imports  : [CoreModule],
                providers: [
                    { provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID },
                    { provide: DOCUMENT, useValue: mockDocument }
                ]
            });

            service = TestBed.inject(DocumentRef);
        })

        it('should allow replacing the documentFactory() implementation', () => expect(service.nativeDocument).toEqual(mockDocument));
    });
});

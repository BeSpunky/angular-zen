import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { WINDOW, WindowRef, WindowRefProviders } from './window-ref.service';

// These are not exported by angular so they are redefined here
const PLATFORM_BROWSER_ID    = 'browser';
const PLATFORM_SERVER_ID     = 'server';
const PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
const PLATFORM_WORKER_UI_ID  = 'browserWorkerUi';

describe('WindowRef', () =>
{
    let service: WindowRef;

    describe('basically', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [ WindowRefProviders ]
            });

            service = TestBed.inject(WindowRef);
        });

        it('should be created', () =>
        {
            expect(service).toBeTruthy();
        });

        it('should allow access to the `window` object', () =>
        {
            expect(typeof service.nativeWindow).toBe('object');
        });
    });

    describe('running on browser platforms', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    { provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID },
                    WindowRefProviders
                ]
            });

            service = TestBed.inject(WindowRef);
        });

        it('should return the `window` object', () =>
        {
            expect(service.nativeWindow.screenX).toBeDefined();
        });
    });

    describe('running on non-browser platforms', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    { provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID },
                    WindowRefProviders
                ]
            });

            service = TestBed.inject(WindowRef);
        });

        it('should return an empty object', () =>
        {
            expect(Object.keys(service.nativeWindow).length).toEqual(0);
        });
    });

    describe('mocking WINDOW', () =>
    {
        let mockWindow = { dummy: 'value' };

        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    { provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID },
                    { provide: WINDOW, useValue: mockWindow }
                ]
            });

            service = TestBed.inject(WindowRef);
        })

        it('should allow replacing the windowFactory() implementation', () => expect(service.nativeWindow).toEqual(mockWindow));
    });
});

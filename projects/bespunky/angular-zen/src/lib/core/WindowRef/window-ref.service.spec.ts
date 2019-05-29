import { TestBed } from '@angular/core/testing';
import { PLATFORM_ID } from '@angular/core';

import { WINDOW, WindowRef, DefaultWindowRefProvider } from './window-ref.service';

// These are not exported by angular so they are redefined here
const PLATFORM_BROWSER_ID = 'browser';
const PLATFORM_SERVER_ID = 'server';
const PLATFORM_WORKER_APP_ID = 'browserWorkerApp';
const PLATFORM_WORKER_UI_ID = 'browserWorkerUi';

describe('WindowRef', () =>
{
    const originStub = 'angular-zen demo';

    let windowMock: any;
    let service: WindowRef;

    beforeEach(() =>
    {
        windowMock = {
            origin: originStub
        };
    });

    describe('basically', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    DefaultWindowRefProvider,
                    { provide: WINDOW, useValue: windowMock }
                ]
            });

            service = TestBed.get(WindowRef);
        });

        it('should be created', () =>
        {
            expect(service).toBeTruthy();
        });

        it('should allow access to the `window` object', () =>
        {
            expect(typeof service.nativeWindow).toBe('object');
        });

        it('should throw a `Not Implemented` error when WindowRef is used directly', () =>
        {
            expect(() => new WindowRef().nativeWindow).toThrowError(/Not implemented/);
        });
    });

    describe('running on browser platforms', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    DefaultWindowRefProvider,
                    { provide: PLATFORM_ID, useValue: PLATFORM_BROWSER_ID },
                    { provide: WINDOW, useValue: windowMock }
                ]
            });

            service = TestBed.get(WindowRef);
        });

        it('should return the `window` object', () =>
        {
            expect(service.nativeWindow).toEqual(windowMock);
        });
    });

    describe('running on non-browser platforms', () =>
    {
        beforeEach(() =>
        {
            TestBed.configureTestingModule({
                providers: [
                    DefaultWindowRefProvider,
                    { provide: PLATFORM_ID, useValue: PLATFORM_SERVER_ID },
                    { provide: WINDOW, useValue: windowMock }
                ]
            });

            service = TestBed.get(WindowRef);
        });

        it('should return an empty object', () =>
        {
            expect(service.nativeWindow).not.toEqual(windowMock);
            expect(service.nativeWindow).not.toContain('origin');
        });
    });
});

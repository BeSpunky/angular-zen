import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DOCUMENT, CoreModule } from '@bespunky/angular-zen/core';
import { LazyLoaderService, AsyncModule } from '@bespunky/angular-zen/async';
import { LazyStyleLoaderDemoComponent, MagicStyleUrl } from './lazy-style-loader-demo.component';

describe('LazyStyleLoaderDemoComponent', () =>
{
    let documentMock: any;
    let lazyLoader: LazyLoaderService
    let component: LazyStyleLoaderDemoComponent;
    let fixture: ComponentFixture<LazyStyleLoaderDemoComponent>;
    let element: DebugElement;

    function initializeMocks()
    {
        documentMock = {};
        lazyLoader = new LazyLoaderService(documentMock, 'browser');
    }

    function setupTestBed()
    {
        TestBed.configureTestingModule({
            declarations: [LazyStyleLoaderDemoComponent],
            imports: [AsyncModule, CoreModule],
            providers: [
                { provide: DOCUMENT, useValue: documentMock },
                { provide: LazyLoaderService, useValue: lazyLoader }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LazyStyleLoaderDemoComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement;
    }

    beforeEach(async(() =>
    {
        initializeMocks();

        setupTestBed();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(LazyStyleLoaderDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    describe('Isolated tests', () =>
    {
        it('should create', () => expect(component).toBeTruthy());

        it('should initialize with `loading` equals `false`', () => expect(component.loading).toBeFalsy());

        it('should load the magic style and manage the `loading` flag when calling `loadStyle()`', fakeAsync(() =>
        {
            const loadStyle = spyOn(lazyLoader, 'loadStyle').and.callFake((url: string) =>
            {
                expect(url).toEqual(MagicStyleUrl);

                // Simulate async style loading
                return timer(1000).pipe(take(1));
            });

            component.loadStyle();

            expect(component.loading).toBeTruthy();
            expect(loadStyle).toHaveBeenCalledTimes(1);

            tick(1000);

            expect(component.loading).toBeFalsy();
        }));
    });

    describe('Shallow tests', () =>
    {
        let button: HTMLButtonElement;

        beforeEach(() => button = element.query(By.css('button')).nativeElement);

        it('button should call `loadStyle()`', () =>
        {
            const loadStyle = spyOn(lazyLoader, 'loadStyle').and.callFake(() => true);

            button.click();

            fixture.whenStable().then(() => expect(loadStyle).toHaveBeenCalledTimes(1));
        });
    });
});

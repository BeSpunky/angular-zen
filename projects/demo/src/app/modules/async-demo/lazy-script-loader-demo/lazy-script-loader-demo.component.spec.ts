import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs';
import { CoreModule, AsyncModule, LazyLoaderService, LazyLoadedFile, WINDOW, DOCUMENT, ScriptLoadOptions } from '@bespunky/angular-zen';

import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo.component';

describe('LazyScriptLoaderDemoComponent', () =>
{
    const scriptLoadTime = 5000;

    let lazyLoaderSpy: jasmine.Spy;
    let lazyLoader: LazyLoaderService;
    let windowMock: any;
    let documentMock: any;
    let lazyScriptStub: LazyLoadedFile;
    let fakeObservable: Observable<LazyLoadedFile>;
    let fakeLoadScript: (url: string, options: ScriptLoadOptions) => Observable<LazyLoadedFile>;

    let component: LazyScriptLoaderDemoComponent;
    let fixture: ComponentFixture<LazyScriptLoaderDemoComponent>;
    let element: DebugElement;

    function initializeMocks()
    {
        windowMock = { $: undefined, jQuery: undefined };
        documentMock = {};
        lazyLoader = new LazyLoaderService(documentMock);
    }

    function setupTestBed()
    {
        TestBed.configureTestingModule({
            declarations: [LazyScriptLoaderDemoComponent],
            imports: [AsyncModule, CoreModule],
            providers: [
                { provide: WINDOW, useValue: windowMock },
                { provide: DOCUMENT, useValue: documentMock },
                { provide: LazyLoaderService, useValue: lazyLoader }
            ]
        }).compileComponents();

        fixture = TestBed.createComponent(LazyScriptLoaderDemoComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement;

        // Seems like TestBed makes copies of all passed in provider mocks.
        // This grabs hold of the copy referenced by the TestBed to allow simulating jquery script load.
        windowMock = TestBed.get(WINDOW);
    }

    function stubLoadScript()
    {
        lazyScriptStub = { type: 'script', url: 'https://code.jquery.com/jquery-3.4.1.min.js', completed: true, element: fixture.elementRef };

        fakeObservable = Observable.create(observer =>
        {
            const simulateLoadComplete = () =>
            {
                // Set a dummy function as if jQuery was loaded
                windowMock.$ = windowMock.jQuery = function() { return this; };

                observer.next(lazyScriptStub);
                observer.complete();
            };

            setTimeout(simulateLoadComplete, scriptLoadTime);
        });

        fakeLoadScript = (url: string, options: ScriptLoadOptions) =>
        {
            // Set a dummy call to already loaded just to be able to spy on it.
            if (options.alreadyLoaded) options.alreadyLoaded(url);

            return fakeObservable;
        };

        lazyLoaderSpy = spyOn(lazyLoader, 'loadScript').and.callFake(fakeLoadScript);
    }

    beforeEach(async(() =>
    {
        initializeMocks();

        setupTestBed();

        stubLoadScript();
    }));

    describe('Isolated test', () =>
    {
        it('should create', () =>
        {
            expect(component).toBeTruthy();
        });

        it('should initialize with an undefined `status`', () => expect(component.status).toBeUndefined());

        it('should have `status` set to \'N/A\' on init', () =>
        {
            component.ngOnInit();

            expect(component.status).toBe('N/A');
        });

        function expectScriptLoad()
        {
            expect(component.status).toMatch(/Loading/);

            tick(scriptLoadTime);

            expect(component.status).toMatch(/Loaded/);
            expect(lazyLoader.loadScript).toHaveBeenCalledTimes(1);
            expect(lazyLoaderSpy.calls.mostRecent().returnValue).toBe(fakeObservable);
        }

        it('should load jQuery when calling `loadUsingDefaults()`', fakeAsync(() =>
        {
            component.loadUsingDefaults();

            expectScriptLoad();
        }));

        it('should load jQuery when calling `overrideAndLoad()`', fakeAsync(() =>
        {
            component.overrideAndLoad();

            expectScriptLoad();
        }));

        it('should use the function provided by `alreadyLoaded` instead of the default one', () =>
        {
            spyOn(lazyLoader, 'isLoaded');

            const alreadyLoadedSpy = spyOn<any>(component, 'alreadyLoaded').and.callThrough();

            component.overrideAndLoad();

            expect(lazyLoader.isLoaded).not.toHaveBeenCalled();
            expect(alreadyLoadedSpy).toHaveBeenCalledTimes(1);
        });
    });

    describe('Shallow test', () =>
    {
        describe('status', () =>
        {
            let b: any;

            beforeEach(() => b = element.query(By.css('b')).nativeElement);

            it('should start empty in the paragraph', () => expect(b.textContent).toBe(''));

            it('should start as \'N/A\' in the paragraph', () =>
            {
                component.ngOnInit();

                fixture.detectChanges();

                expect(b.textContent).toBe('N/A');
            });

            function loadScriptsAsyncAndDetectChanges()
            {
                component.ngOnInit();

                fixture.detectChanges();

                component.loadUsingDefaults();

                fixture.detectChanges();
            }

            it('should change to \'Loading\' when script is being loaded', fakeAsync(() =>
            {
                loadScriptsAsyncAndDetectChanges();

                expect(b.textContent).toMatch(/Loading/);

                tick(scriptLoadTime);
            }));

            it('should change to \'Loaded\' after script has loaded', fakeAsync(() =>
            {
                loadScriptsAsyncAndDetectChanges();

                tick(scriptLoadTime);

                fixture.detectChanges();

                expect(b.textContent).toMatch(/Loaded/);
            }));
        });

        describe('`window.$` value', () =>
        {
            let code: any;

            beforeEach(() => code = element.query(By.css('code')).nativeElement);

            it('should start empty', () => expect(code.textContent).toBe('window.$ === '));

            it('should change to `undefined` on init', () =>
            {
                fixture.detectChanges();

                expect(code.textContent).toMatch(/undefined/);
            });

            it('should change to function after script has loaded', fakeAsync(() =>
            {
                component.loadUsingDefaults();

                tick(scriptLoadTime);

                fixture.detectChanges();

                expect(code.textContent).toMatch(/function/);
            }));
        });

        describe('Buttons', () =>
        {
            let buttons: DebugElement[];

            beforeEach(() => buttons = element.queryAll(By.css('button')));

            function expectClickToTriggerMethod(buttonIndex, methodName)
            {
                spyOn(component, methodName);

                buttons[buttonIndex].nativeElement.click();

                expect(component[methodName]).toHaveBeenCalledTimes(1);
            }

            it('should trigger `loadUsingDefaults()` when clicking the first button', () =>
            {
                expectClickToTriggerMethod(0, 'loadUsingDefaults');
            });

            it('should trigger `loadUsingDefaults()` when clicking the first button', () =>
            {
                expectClickToTriggerMethod(1, 'overrideAndLoad');
            });
        });
    });
});

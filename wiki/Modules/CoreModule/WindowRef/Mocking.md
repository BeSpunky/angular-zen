# Mocking and Replacing Implementation
In certain cases, the default implementation provided by the service might not answer the needs of your code.
One such case is testing.

When testing, we sometimes need to simulate the internal workings of the native `window` object.
Assuming you injected `WindowRef` into your component or service:
```typescript
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, WindowRef, WINDOW } from '@bespunky/angular-zen/core';

import { WindowRefDemoComponent } from './window-ref-demo.component';

describe('WindowRefDemoComponent', () =>
{
    let component : WindowRefDemoComponent;
    let fixture   : ComponentFixture<WindowRefDemoComponent>;
    let element   : DebugElement;
    let windowMock: any;
    let windowRef : WindowRef;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [WindowRefDemoComponent],
            // 1. Import CoreModule
            imports: [CoreModule],
            providers: [
                // 2. Provide the TestBed module with a new value for WINDOW
                { provide: WINDOW, useValue: { screen: { width: 1024, height: 768 } } }
            ]
        }).compileComponents();
        
        ...

        // 3. Get a hold of the WindowRef implementation and our mock window object
        windowRef  = TestBed.inject(WindowRef);
        windowMock = TestBed.inject(WINDOW);
    }));

    it('should ...', () => {
        expect(windowRef.nativeWindow).toBe(windowMock);
        expect(windowRef.nativeWindow.screen.width).toBe(1024);
    });
});
```

See [demo project](https://dev.azure.com/BeSpunky/Libraries/_git/angular-zen?path=%2Fprojects%2Fdemo%2Fsrc%2Fapp%2Fmodules%2Fcore-demo%2Fwindow-ref-demo&version=GBmaster) for more mocking and testing examples.
import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CoreModule, WINDOW } from '@bespunky/angular-zen';

import { WindowRefDemoComponent } from './window-ref-demo.component';

describe('WindowRefDemoComponent', () =>
{
    const windowMock = {
        screen: { width: 1024, height: 768 }
    };

    let component: WindowRefDemoComponent;
    let fixture: ComponentFixture<WindowRefDemoComponent>;
    let element: DebugElement;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [WindowRefDemoComponent],
            imports: [CoreModule],
            providers: [
                { provide: WINDOW, useValue: windowMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(WindowRefDemoComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('Isolation Tests', () =>
    {
        it('should create', () => expect(component).toBeTruthy());

        it('should initialize with an undefined screen object', () => expect(component.screen).toBeUndefined());

        it('should set `screen` to the window\'s screen object on init', () =>
        {
            component.ngOnInit();

            expect(component.screen).toEqual(windowMock.screen);
        });
    });

    describe('Shallow test', () =>
    {
        let b: any;

        beforeEach(() => b = element.query(By.css('b')).nativeElement);

        it('should start with no screen size in the paragraph', () => expect(b.textContent).toBe(''));

        it('should be assigned screen size in the paragraph after init', () =>
        {
            component.ngOnInit();

            fixture.detectChanges();

            expect(b.textContent).toBe(`${windowMock.screen.width}x${windowMock.screen.height}`);
        });
    });
});

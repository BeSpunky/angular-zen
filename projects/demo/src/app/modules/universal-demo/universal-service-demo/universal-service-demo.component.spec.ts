import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UniversalModule } from '@bespunky/angular-zen/universal';

import { UniversalServiceDemoComponent } from './universal-service-demo.component';

describe('UniversalServiceDemoComponent', () =>
{
    let component: UniversalServiceDemoComponent;
    let fixture: ComponentFixture<UniversalServiceDemoComponent>;
    let element: DebugElement;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [UniversalServiceDemoComponent],
            imports: [UniversalModule]
        }).compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(UniversalServiceDemoComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });

    it('should expose the universal service', () =>
    {
        expect(component.universal).toBeDefined();
    });
    
    it('should present detected platform statuses in the table', () =>
    {
        const browser   = element.query(By.css('#isBrowser'));
        const server    = element.query(By.css('#isServer'));
        const workerApp = element.query(By.css('#isWorkerApp'));
        const workerUi  = element.query(By.css('#isWorkerUi'));

        expect(browser.nativeElement.textContent).toEqual(component.universal.isPlatformBrowser.toString());
        expect(server.nativeElement.textContent).toEqual(component.universal.isPlatformServer.toString());
        expect(workerApp.nativeElement.textContent).toEqual(component.universal.isPlatformWorkerApp.toString());
        expect(workerUi.nativeElement.textContent).toEqual(component.universal.isPlatformWorkerUi.toString());
    });
});

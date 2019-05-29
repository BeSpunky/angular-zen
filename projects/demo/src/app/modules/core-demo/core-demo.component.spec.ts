import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { CoreModule } from '@bespunky/angular-zen';

import { CoreDemoComponent } from './core-demo.component';
import { WindowRefDemoComponent } from './window-ref-demo/window-ref-demo.component';
import { DocumentRefDemoComponent } from './document-ref-demo/document-ref-demo.component';
import { By } from '@angular/platform-browser';

describe('CoreDemoComponent', () =>
{
    let component: CoreDemoComponent;
    let fixture: ComponentFixture<CoreDemoComponent>;
    let element: DebugElement;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [CoreDemoComponent, WindowRefDemoComponent, DocumentRefDemoComponent],
            imports: [CoreModule]
        }).compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(CoreDemoComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });

    it('should have CoreModules demos displayed', () =>
    {
        const h5s = element.queryAll(By.css('h5'));

        expect(h5s.find((e) => e.nativeElement.textContent === 'DocumentRef Service')).toBeDefined();
        expect(h5s.find((e) => e.nativeElement.textContent === 'WindowRef Service')).toBeDefined();
    });
});

import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { UniversalModule} from '@bespunky/angular-zen';

import { UniversalDemoComponent } from './universal-demo.component';
import { UniversalServiceDemoComponent } from './universal-service-demo/universal-service-demo.component';

describe('UniversalDemoComponent', () =>
{
    let component: UniversalDemoComponent;
    let fixture: ComponentFixture<UniversalDemoComponent>;
    let element: DebugElement;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [UniversalDemoComponent, UniversalServiceDemoComponent],
            imports: [UniversalModule.forRoot()]
        }).compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(UniversalDemoComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });

    it('should have UniversalModule\'s demos displayed', () =>
    {
        const h5s = element.queryAll(By.css('h5'));

        expect(h5s.find((e) => e.nativeElement.textContent === 'UniversalService')).toBeDefined();
    });
});

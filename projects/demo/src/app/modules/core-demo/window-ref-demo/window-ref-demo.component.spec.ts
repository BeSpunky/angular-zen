import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@bespunky/angular-zen';

import { WindowRefDemoComponent } from './window-ref-demo.component';

describe('WindowRefDemoComponent', () =>
{
    let component: WindowRefDemoComponent;
    let fixture: ComponentFixture<WindowRefDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [WindowRefDemoComponent],
            imports: [CoreModule]
        })
            .compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(WindowRefDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });
});

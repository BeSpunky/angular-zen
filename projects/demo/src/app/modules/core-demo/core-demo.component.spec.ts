import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreDemoComponent } from './core-demo.component';

describe('CoreDemoComponent', () =>
{
    let component: CoreDemoComponent;
    let fixture: ComponentFixture<CoreDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [CoreDemoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(CoreDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });
});

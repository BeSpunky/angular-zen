import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoaderDemoComponent } from './loader-demo.component';

describe('LoaderDemoComponent', () =>
{
    let component: LoaderDemoComponent;
    let fixture: ComponentFixture<LoaderDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [LoaderDemoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(LoaderDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });
});

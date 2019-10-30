import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyStyleLoaderDemoComponent } from './lazy-style-loader-demo.component';

describe('LazyStyleLoaderDemoComponent', () =>
{
    let component: LazyStyleLoaderDemoComponent;
    let fixture: ComponentFixture<LazyStyleLoaderDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [LazyStyleLoaderDemoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(LazyStyleLoaderDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });
});

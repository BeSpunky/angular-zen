import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo.component';

describe('LazyScriptLoaderDemoComponent', () =>
{
    let component: LazyScriptLoaderDemoComponent;
    let fixture: ComponentFixture<LazyScriptLoaderDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [LazyScriptLoaderDemoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(LazyScriptLoaderDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });
});

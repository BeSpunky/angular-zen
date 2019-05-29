import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, LoaderModule } from '@bespunky/angular-zen';

import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo.component';

describe('LazyScriptLoaderDemoComponent', () =>
{
    let component: LazyScriptLoaderDemoComponent;
    let fixture: ComponentFixture<LazyScriptLoaderDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [LazyScriptLoaderDemoComponent],
            imports: [LoaderModule, CoreModule]
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

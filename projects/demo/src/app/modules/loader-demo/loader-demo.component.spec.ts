import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderModule, CoreModule } from '@bespunky/angular-zen';

import { LoaderDemoComponent } from './loader-demo.component';
import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo/lazy-script-loader-demo.component';

describe('LoaderDemoComponent', () =>
{
    let component: LoaderDemoComponent;
    let fixture: ComponentFixture<LoaderDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [LoaderDemoComponent, LazyScriptLoaderDemoComponent],
            imports: [LoaderModule, CoreModule]
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

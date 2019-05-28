import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoaderModule } from 'angular-zen';

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
            imports: [LoaderModule]
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

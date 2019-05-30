import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { LoaderModule, CoreModule } from '@bespunky/angular-zen';

import { LoaderDemoComponent } from './loader-demo.component';
import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo/lazy-script-loader-demo.component';

describe('LoaderDemoComponent', () =>
{
    let component: LoaderDemoComponent;
    let fixture: ComponentFixture<LoaderDemoComponent>;
    let element: DebugElement;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [LoaderDemoComponent, LazyScriptLoaderDemoComponent],
            imports: [LoaderModule, CoreModule]
        }).compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(LoaderDemoComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });

    it('should have LoaderModule\'s demos displayed', () =>
    {
        const h5s = element.queryAll(By.css('h5'));

        expect(h5s.find((e) => e.nativeElement.textContent === 'LazyScriptLoaderService')).toBeDefined();
    });
});

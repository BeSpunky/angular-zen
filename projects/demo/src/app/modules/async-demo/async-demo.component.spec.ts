import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { AsyncModule, CoreModule } from '@bespunky/angular-zen';

import { AsyncDemoComponent } from './async-demo.component';
import { LazyScriptLoaderDemoComponent } from './lazy-script-loader-demo/lazy-script-loader-demo.component';
import { LazyStyleLoaderDemoComponent } from './lazy-style-loader-demo/lazy-style-loader-demo.component';

describe('AsyncDemoComponent', () =>
{
    let component: AsyncDemoComponent;
    let fixture: ComponentFixture<AsyncDemoComponent>;
    let element: DebugElement;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [AsyncDemoComponent, LazyScriptLoaderDemoComponent, LazyStyleLoaderDemoComponent],
            imports: [AsyncModule, CoreModule]
        }).compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(AsyncDemoComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement;

        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });

    it('should have AsyncModule\'s demos displayed', () =>
    {
        const h5s = element.queryAll(By.css('h5'));
        const titles = h5s.map(e => e.nativeElement.innerHTML);

        expect([
            'LazyLoaderService.loadScript()',
            'LazyLoaderService.loadStyle()'
        ].every(titles.includes.bind(titles))).toBeTruthy();
    });
});

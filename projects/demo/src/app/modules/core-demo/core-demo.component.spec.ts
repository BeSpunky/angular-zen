import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from 'angular-zen';

import { CoreDemoComponent } from './core-demo.component';
import { WindowRefDemoComponent } from './window-ref-demo/window-ref-demo.component';
import { DocumentRefDemoComponent } from './document-ref-demo/document-ref-demo.component';

describe('CoreDemoComponent', () =>
{
    let component: CoreDemoComponent;
    let fixture: ComponentFixture<CoreDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [CoreDemoComponent, WindowRefDemoComponent, DocumentRefDemoComponent],
            imports: [CoreModule]
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

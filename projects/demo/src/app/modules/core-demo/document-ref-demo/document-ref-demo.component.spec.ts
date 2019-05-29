import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule } from '@bespunky/angular-zen';

import { DocumentRefDemoComponent } from './document-ref-demo.component';

describe('DocumentRefDemoComponent', () =>
{
    let component: DocumentRefDemoComponent;
    let fixture: ComponentFixture<DocumentRefDemoComponent>;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [DocumentRefDemoComponent],
            imports: [CoreModule]
        })
            .compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(DocumentRefDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () =>
    {
        expect(component).toBeTruthy();
    });
});

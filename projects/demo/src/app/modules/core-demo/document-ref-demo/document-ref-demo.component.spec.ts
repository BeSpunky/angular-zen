import { By } from '@angular/platform-browser';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CoreModule, DOCUMENT } from '@bespunky/angular-zen';

import { DocumentRefDemoComponent } from './document-ref-demo.component';
import { DebugElement } from '@angular/core';

describe('DocumentRefDemoComponent', () =>
{
    const documentMock = {
        title: 'demo'
    };

    let component: DocumentRefDemoComponent;
    let fixture: ComponentFixture<DocumentRefDemoComponent>;
    let element: DebugElement;

    beforeEach(async(() =>
    {
        TestBed.configureTestingModule({
            declarations: [DocumentRefDemoComponent],
            imports: [CoreModule],
            providers: [
                { provide: DOCUMENT, useValue: documentMock }
            ]
        }).compileComponents();
    }));

    beforeEach(() =>
    {
        fixture = TestBed.createComponent(DocumentRefDemoComponent);

        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    describe('Isolation Tests', () =>
    {
        it('should create', () => expect(component).toBeTruthy());

        it('should initialize with an undefined title', () => expect(component.title).toBeUndefined());

        it('should set `title` to the document\'s title on init', () =>
        {
            component.ngOnInit();

            expect(component.title).toBe(documentMock.title);
        });
    });

    describe('Shallow test', () =>
    {
        let b: any;

        beforeEach(() => b = element.query(By.css('b')).nativeElement);

        it('should start with no title value in the paragraph', () => expect(b.textContent).toBe(''));

        it('should be assigned document title in the paragraph after init', () =>
        {
            component.ngOnInit();

            fixture.detectChanges();

            expect(b.textContent).toBe(documentMock.title);
        });
    });
});

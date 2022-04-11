import { Observable                             } from 'rxjs';
import { Component, Directive, Input, ViewChild } from '@angular/core';
import { ComponentFixture, TestBed              } from '@angular/core/testing';

import { ObserveModule          } from '../observe.module';
import { ObserveBaseDirective   } from './observe-base.directive';
import { ResolvedObserveContext } from './types/general';

describe('ObserveBaseDirective', () =>
{
    let directive    : ObserveTesterDirective;
    let fixture      : ComponentFixture<ObserveTestHostComponent>;
    let hostComponent: ObserveTestHostComponent;

    beforeEach(async () =>
    {
        await TestBed.configureTestingModule({
            imports     : [ObserveModule],
            declarations: [ObserveTesterDirective, ObserveTestHostComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(ObserveTestHostComponent);
        fixture.detectChanges();

        hostComponent = fixture.componentInstance;
        directive     = hostComponent.testerDirective;
    })

    it('should be created', () => expect(directive).toBeDefined());
    it('should render the template immediately when created', () => {  });
    it('should subscribe to the passed in observable', () => {  });
    it('should unsubscribe from the passed in observable on destroy', () => {  });
    it('should unsubscribe and switch observables when the passed in observable changes', () => {  });
    it('should update the view context with the latest value emitted by the watched observable', () => {  });
    it('should update the view context with the latest multicasted version of the observable', () => {  });
    it('should allow access to the emitted value through an implicit `let` variable', () => {  });
    it('should allow access to the emitted value through an variable defined using the `as` microsyntax', () => {  });
    it('should allow access to the latest multicasted version of the observable using a let variable for `source`', () => {  });
    it('should trigger the `nextCalled` event when the source observable emits a value', () => {  });
    it('should trigger the `completeCalled` event when the source observable completes', () => {  });
    it('should trigger the `errorCalled` event when the source observable errors', () => {  });
    it('should trigger the `completeCalled` event when no source observable is passed in', () => {  });
});

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[observeTester]'
})
class ObserveTesterDirective extends ObserveBaseDirective<Observable<number>, number, ResolvedObserveContext<number>>
{
    protected selector = 'observeTester';

    @Input() public observeTester(input: Observable<number>) { this.input.next(input); }

    protected observeInput(input: Observable<number>): Observable<number>
    {
        return input;
    }
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'observe-test-host',
    template: /*html*/`
        <div *observeTester="testedObservable as result; let implicitResult; let source = source">
        </div>
    `
})
class ObserveTestHostComponent
{
    @Input() public testedObservable?: Observable<number>

    @ViewChild(ObserveTesterDirective) public testerDirective!: ObserveTesterDirective;
}
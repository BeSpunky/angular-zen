import { Observable             } from 'rxjs';
import { Component, Directive, Input              } from '@angular/core';

import { ObserveBaseDirective   } from './observe-base.directive';
import { ResolvedObserveContext } from './types/general';

describe('ObserveBaseDirective', () =>
{
    it('should be created', () => {  });
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

    protected observeInput(input: Observable<number>): Observable<number>
    {
        return input;
    }
}

@Component({
    // eslint-disable-next-line @angular-eslint/component-selector
    selector: 'observe-test',
    template: /*html*/`
        <div *observeTester="testedObservable as result; let implicitResult; let source = source">
        </div>
    `
})
class ObserveTestHostComponent
{
    @Input() public testedObservable?: Observable<number>
}
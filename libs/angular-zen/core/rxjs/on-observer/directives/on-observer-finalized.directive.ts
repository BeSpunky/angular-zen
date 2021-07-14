import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverState } from '../abstraction/types/general';
import { OnObserverBaseDirective           } from '../abstraction/on-observer-base.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserverFinalized]'
})
export class OnObserverFinalizedDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector                         = 'onObserverFinalized';
    protected renderOnCallsTo: ObserverState[] = ['error', 'complete'];
    
    @Input() public set onObserverFinalized(value: Observable<T>) { this.input.next(value); }

    @Input() public set onObserverFinalizedShowAfter         (duration: DurationAnnotation) { this.showAfter          = duration; }
    @Input() public set onObserverFinalizedShowFor           (duration: DurationAnnotation) { this.showFor            = duration; };
    @Input() public set onObserverFinalizedCountdownPrecision(duration: DurationAnnotation) { this.countdownPrecision = duration; };
}
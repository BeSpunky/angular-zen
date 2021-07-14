import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverState } from '../abstraction/types/general';
import { OnObserverBaseDirective           } from '../abstraction/on-observer-base.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserverComplete]'
})
export class OnObserverCompleteDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector             = 'onObserverComplete';
    protected calls: ObserverState = 'complete';
    
    @Input() public set onObserverComplete(value: Observable<T>) { this.input.next(value); }

    @Input() public set onObserverCompleteShowAfter         (duration: DurationAnnotation) { this.showAfter          = duration; }
    @Input() public set onObserverCompleteShowFor           (duration: DurationAnnotation) { this.showFor            = duration; };
    @Input() public set onObserverCompleteCountdownPrecision(duration: DurationAnnotation) { this.countdownPrecision = duration; };
}
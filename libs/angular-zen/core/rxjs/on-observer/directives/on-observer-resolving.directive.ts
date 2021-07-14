import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverState } from '../abstraction/types/general';
import { OnObserverBaseDirective           } from '../abstraction/on-observer-base.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserverResolving]'
})
export class OnObserverResolvingDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector             = 'onObserverResolving';
    protected calls: ObserverState = 'resolving';
    
    @Input() public set onObserverResolving(value: Observable<T>) { this.input.next(value); }

    @Input() public set onObserverResolvingShowAfter         (duration: DurationAnnotation) { this.showAfter          = duration; }
    @Input() public set onObserverResolvingShowFor           (duration: DurationAnnotation) { this.showFor            = duration; };
    @Input() public set onObserverResolvingCountdownPrecision(duration: DurationAnnotation) { this.countdownPrecision = duration; };
}
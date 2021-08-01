import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverName, ViewMode } from '../abstraction/types/general';
import { OnObserverContext                          } from '../abstraction/types/on-observer-context';
import { OnObserverBaseDirective                    } from '../abstraction/on-observer-base.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserverNext]'
})
export class OnObserverNextDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector                      = 'onObserverNext';
    protected renderOnCallsTo: ObserverName = 'next';
    
    @Input() public set onObserverNext(value: Observable<T>) { this.input.next(value); }

    @Input() public set onObserverNextViewMode         (viewMode: ViewMode          ) { this.viewMode          = viewMode; }
    @Input() public set onObserverNextShowAfter        (duration: DurationAnnotation) { this.showAfter         = duration; }
    @Input() public set onObserverNextShowFor          (duration: DurationAnnotation) { this.showFor           = duration; };
    @Input() public set onObserverNextCountdownInterval(duration: DurationAnnotation) { this.countdownInterval = duration; };

    static ngTemplateContextGuard<T>(directive: OnObserverNextDirective<T>, context: unknown): context is OnObserverContext<T> { return true; }
}
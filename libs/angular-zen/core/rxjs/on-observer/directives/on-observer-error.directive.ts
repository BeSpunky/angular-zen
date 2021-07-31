import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverName, ViewMode } from '../abstraction/types/general';
import { OnObserverContext                          } from '../abstraction/types/on-observer-context';
import { OnObserverBaseDirective                    } from '../abstraction/on-observer-base.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserverError]'
})
export class OnObserverErrorDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector                      = 'onObserverError';
    protected renderOnCallsTo: ObserverName = 'error';
    
    @Input() public set onObserverError(value: Observable<T>) { this.input.next(value); }

    @Input() public set onObserverErrorViewMode          (viewMode: ViewMode          ) { this.viewMode           = viewMode; }
    @Input() public set onObserverErrorShowAfter         (duration: DurationAnnotation) { this.showAfter          = duration; }
    @Input() public set onObserverErrorShowFor           (duration: DurationAnnotation) { this.showFor            = duration; };
    @Input() public set onObserverErrorCountdownPrecision(duration: DurationAnnotation) { this.countdownPrecision = duration; };

    static ngTemplateContextGuard<T>(directive: OnObserverErrorDirective<T>, context: unknown): context is OnObserverContext<T> { return true; }
}
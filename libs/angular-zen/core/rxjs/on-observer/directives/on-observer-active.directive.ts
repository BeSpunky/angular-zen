import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverName, ViewMode } from '../abstraction/types/general';
import { OnObserverContext                          } from '../abstraction/types/on-observer-context';
import { OnObserverBaseDirective                    } from '../abstraction/on-observer-base.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserverActive]'
})
export class OnObserverActiveDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector                        = 'onObserverActive';
    protected renderOnCallsTo: ObserverName[] = ['resolving', 'next'];
    
    @Input() public set onObserverActive(value: Observable<T>) { this.input.next(value); }

    @Input() public set onObserverActiveViewMode          (viewMode: ViewMode          ) { this.viewMode           = viewMode; }
    @Input() public set onObserverActiveShowAfter         (duration: DurationAnnotation) { this.showAfter          = duration; }
    @Input() public set onObserverActiveShowFor           (duration: DurationAnnotation) { this.showFor            = duration; };
    @Input() public set onObserverActiveCountdownPrecision(duration: DurationAnnotation) { this.countdownPrecision = duration; };

    static ngTemplateContextGuard<T>(directive: OnObserverActiveDirective<T>, context: unknown): context is OnObserverContext<T> { return true; }
}
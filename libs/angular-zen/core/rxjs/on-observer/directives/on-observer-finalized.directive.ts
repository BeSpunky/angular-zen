import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverName, ViewMode } from '../abstraction/types/general';
import { OnObserverContext                          } from '../abstraction/types/on-observer-context';
import { OnObserverBaseDirective                    } from '../abstraction/on-observer-base.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserverFinalized]'
})
export class OnObserverFinalizedDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector                        = 'onObserverFinalized';
    protected renderOnCallsTo: ObserverName[] = ['error', 'complete'];
    
    @Input() public set onObserverFinalized(value: Observable<T>) { this.input.next(value); }

    @Input() public set onObserverFinalizedViewMode          (viewMode: ViewMode          ) { this.viewMode           = viewMode; }
    @Input() public set onObserverFinalizedShowAfter         (duration: DurationAnnotation) { this.showAfter          = duration; }
    @Input() public set onObserverFinalizedShowFor           (duration: DurationAnnotation) { this.showFor            = duration; };
    @Input() public set onObserverFinalizedCountdownPrecision(duration: DurationAnnotation) { this.countdownPrecision = duration; };

    static ngTemplateContextGuard<T>(directive: OnObserverFinalizedDirective<T>, context: unknown): context is OnObserverContext<T> { return true; }
}
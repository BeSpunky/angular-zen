import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverName, ViewMode } from '../abstraction/types/general';
import { OnObserverContext                          } from '../abstraction/types/on-observer-context';
import { OnObserverBaseDirective                    } from '../abstraction/on-observer-base.directive';

@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserver]'
})
export class OnObserverDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector = 'onObserver';
    protected renderOnCallsTo!: ObserverName | ObserverName[];
    
    @Input() public set onObserver(value: Observable<T>) { this.input.next(value); }

    @Input() public set onObserverCalls(calls: ObserverName | ObserverName[]) { this.renderOnCallsTo = calls; }

    @Input() public set onObserverViewMode          (viewMode: ViewMode          ) { this.viewMode           = viewMode; }
    @Input() public set onObserverShowAfter         (duration: DurationAnnotation) { this.showAfter          = duration; }
    @Input() public set onObserverShowFor           (duration: DurationAnnotation) { this.showFor            = duration; };
    @Input() public set onObserverCountdownPrecision(duration: DurationAnnotation) { this.countdownPrecision = duration; };

    static ngTemplateContextGuard<T>(directive: OnObserverDirective<T>, context: unknown): context is OnObserverContext<T> { return true; }
}
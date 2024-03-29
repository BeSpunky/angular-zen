import { Observable       } from 'rxjs';
import { Directive, Input } from '@angular/core';

import { DurationAnnotation, ObserverName, ViewMode } from '../abstraction/types/general';
import { OnObserverContext                          } from '../abstraction/types/on-observer-context';
import { OnObserverBaseDirective                    } from '../abstraction/on-observer-base.directive';

/**
 * Documentation in {@link OnObserverErrorDirective.onObserverError} to allow in-template tooltips.
 *
 * @export
 * @class OnObserverErrorDirective
 * @extends {OnObserverBaseDirective<T>}
 * @template T The type of value the observable emits.
 */
@Directive({
    // eslint-disable-next-line @angular-eslint/directive-selector
    selector: '[onObserverError]'
})
export class OnObserverErrorDirective<T> extends OnObserverBaseDirective<T>
{
    protected selector                      = 'onObserverError';
    protected renderOnCallsTo: ObserverName = 'error';
    
    /**
     * Renders the template when the specified observable errors. The error will be provided as the value in context.
     * 
     * ## Features
     * 
     * #### View Context
     * Use the microsyntax `as` keyword to assign resolved values to a variable.
     * Use the microsyntax `let` keyword to assign the {@link OnObserverContext full context object} to a variable (e.g. `let context`).
     *  
     * #### Delayed rendering
     * Specify a value for {@link OnObserverBaseDirective.showAfter `showAfter`} to delay rendering.
     * 
     * #### Auto destroy
     * Specify {@link OnObserverBaseDirective.showFor `showFor`} to automatically destroy the view after a certain duration.
     * 
     * #### Countdown updates
     * When {@link OnObserverBaseDirective.showFor `showFor`} is specified, the view context will be updated with the time remaining until the view
     * is destroyed and the time elapsed since it was rendered. This allows giving the user feedback in a progress bar, a spinner, a textual timer
     * or any other UI component. 
     * 
     * Remaining is provided by the {@link OnObserverContext.remaining `remaining`} property. Elapsed time is provided by the {@link OnObserverContext.elapsed `elapsed`}
     * property. Access it by assigning a variable using `let`, like so:  
     * `let remaining = remaining`
     * 
     * #### Multi view mode
     * Specify {@link OnObserverBaseDirective.viewMode `viewMode = 'multiple'`} to enable rendering a new view for each intercepted call
     * instead of updating a single rendered view. This allows stacking logs, notification snackbars, or any other aggregation functionality.
     * Combined with {@link OnObserverBaseDirective.showFor `showFor`}, this is great for disappearing messages/notifications.
     * 
     * #### View index
     * In multi-view mode, the context will contain the index of the view, which can be used for calculations and styling.
     */
    @Input() public set onObserverError(value: Observable<T>) { this.input.next(value); }

    /**
     * (Optional) The view mode the directive will operate in:  
     * `'single'` - A single view will be rendered on intercepted calls. If a view has already been rendered when a call is intercepted,
     * the existing view will be updated with data from the new call.
     * 
     * `'multiple'` - Every new intercepted call will render a new view with its own context and data encapsulated from the current call.
     * 
     * Default is `'single'`.
     */
    @Input() public set onObserverErrorViewMode         (viewMode: ViewMode          ) { this.viewMode          = viewMode; }
    /**
     * (Optional) The duration for which the directive should wait before rendering the view once an intercepted call is made.
     * 
     * You can specify a number, which will be treated as milliseconds, or a string with the format of `<number><ms | s | ms>`.
     * Numbers can be either integers or floats.
     * For example:
     * - `3000` - Wait for 3 seconds, then render the view.
     * - `'10s'` - Wait for 10 seconds, then render the view.
     * - `'0.5m'` - Wait for 30 seconds, then render the view.
     * - `'100ms'` - Wait for 100 milliseconds, then render the view.
     * 
     * Default is `0`, meaning immediately render the view.
     *
     * TODO: ADD LINK TO TOUR OR FULL WIKI PAGE
     * Read more {@link OnObserverBaseDirective About render flow}.
     **/
    @Input() public set onObserverErrorShowAfter        (duration: DurationAnnotation) { this.showAfter         = duration; }
    /**
     * (Optional) The duration for which the view should be rendered. When the duration passes, the view will be auto destroyed.
     *
     * You can specify a number, which will be treated as milliseconds, or a string with the format of `<number><ms | s | ms>`.
     * Numbers can be either integers or floats.
     * For example:
     * - `3000` - The view will be destroyed after 3 seconds.
     * - `'10s'` - The view will be destroyed after 10 seconds.
     * - `'0.5m'` - The view will be destroyed after 30 seconds.
     * - `'100ms'` - The view will be destroyed after 100 milliseconds.
     * 
     * During the time the view is rendered, the context will be updated with a countdown object to facilitate any UI part used to
     * indicate countdown to the user. The countdown will be exposed through the {@link OnObserverContext.remaining `remaining`}
     * property and the elapsed time through {@link OnObserverContext.elapsed `elapsed`} property in the view context and can both
     * be accessed be declaring a `let` variable (e.g. `let remaining = remaining`).
     * See {@link OnObserverBaseDirective.countdownInterval `countdownInterval`} for changing the updates interval.
     * 
     * When unspecified, the view will be destroyed immediately once the observer detects a call different to the intercepted ones.
     * 
     * TODO: ADD LINK TO TOUR OR FULL WIKI PAGE
     * Read more {@link OnObserverBaseDirective About render flow}.
     **/
    @Input() public set onObserverErrorShowFor          (duration: DurationAnnotation) { this.showFor           = duration; };
    /**
     * ### Only used when passing a value to {@link OnObserverBaseDirective.showFor `showFor`}.
     * 
     * (Optional) The interval with which countdown updates should be made to the view's context before it auto destroys.
     * The lower the value, the more updates will be made to the context, but the more resources your directive will consume.
     * 
     * You can specify a number, which will be treated as milliseconds, or a string with the format of `<number><ms | s | ms>`.
     * Numbers can be either integers or floats.
     * For example:
     * - `3000` - 3 seconds between each update.
     * - `'10s'` - 10 seconds between each update.
     * - `'0.5m'` - 30 seconds between each update.
     * - `'100ms'` - 100 milliseconds between each update.
     * 
     * You can also specify `'animationFrames'` so the countdown gets updated each time the browser is working on animations.
     * 
     * When unspecified, the total duration of the countdown will be divided by {@link DefaultCountdownUpdateCount `DefaultCountdownUpdateCount`}
     * to get a fixed interval which will make for {@link DefaultCountdownUpdateCount `DefaultCountdownUpdateCount`} countdown updates.
     */
    @Input() public set onObserverErrorCountdownInterval(duration: DurationAnnotation | 'animationFrames') { this.countdownInterval = duration; };
 
    static ngTemplateContextGuard<T>(directive: OnObserverErrorDirective<T>, context: unknown): context is OnObserverContext<T> { return true; }
}
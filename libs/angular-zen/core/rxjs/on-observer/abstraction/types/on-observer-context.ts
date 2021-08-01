import { ObserverName, DurationBreakdown } from './general';
import { ViewRenderState                 } from './view-render-state';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OnObserverBaseDirective } from '../on-observer-base.directive';

/**
 * Represents the context to be fed into a view rendered by an {@link OnObserverBaseDirective `*onObserver`} directive.
 * The context is immutable.
 *
 * @export
 * @class OnObserverContext
 * @template TResolved The type of value emitted by the observable the directive is observing.
 */
export class OnObserverContext<TResolved>
{
    // Indexer allows `this[selector]`. See `selector` constructor argument for details.
    [key: string]: unknown;

    /**
     * The resolved value as emitted by the original observable.
     * This allows assigning the emitted value to a variable using `let varName;`.
     * 
     * @type {TResolved}
     */
    public readonly $implicit?: TResolved;

    /**
     *  Creates an instance of OnObserverContext.
     */
    constructor(
        /**
         * The selector of the directive which is creating this context. This will be used to assign the emitted value to a
         * property matching the selector, thus enabling the use of the microsyntax `as` keyword.
         */
                        selector   : string,
        /** The index of the view rendered by the directive. If the directive is in `'single'` view mode, this will always be 0. */
        public readonly index      : number,
        /** The name of the observer call which triggered this context creation. */
        public readonly call       : ObserverName,
        /** (Optional) The value, if any, that was emitted by the original observable. */
                        value?     : TResolved,
        /**
         * (Optional) The time left for the view to be rendered. Only used when {@link OnObserverBaseDirective.showFor `showFor`}
         * is specified in the directive.
         */
        public readonly showingFor?: DurationBreakdown
    )
    {
        this.$implicit = this[selector] = value;
    }

    /**
     * Creates a context object for the specified view render state.
     *
     * @static
     * @template T The type of value emitted by the observable.
     * @param {string} onObserverSelector The selector of the directive which is creating this context.
     * @param {number} index The index of the view rendered by the directive.
     * @param {ViewRenderState<T>} state The view render state from which to create the context.
     * @return {OnObserverContext<T>} A context object for the specified view render state.
     */
    static fromState<T>(onObserverSelector: string, index: number, { call: { name, value } }: ViewRenderState<T>): OnObserverContext<T>
    {
        return new OnObserverContext(onObserverSelector, index, name, value);
    }
};

import { RenderedView } from './general';
import { ObserverCall } from './observer-call';

/**
 * Represents a state describing a view to be rendered or a view already rendered. The state holds the parameterization indicating
 * when a view should be rendered and destroyed, and also holds the rendered view if there is any.
 * 
 * States are created every time an {@link ObserverCall} is emitted. They are used by {@link OnObserverBaseDirective `*onObserver`} directives
 * to understand how a view should be rendered and initiate a commitment to render flow.
 *
 * The state is immutable.
 * 
 * @export
 * @class ViewRenderState
 * @template T The type of value emitted by the observable.
 */
export class ViewRenderCommitment<T>
{
    /**
     *  Creates an instance of ViewRenderState.
     */
    private constructor(
        /** The id of the commitment to render. Allows identifying the state within a state map. */
        public readonly commitmentId: string,
        /** The intercepted call which triggered the commitment to render. */
        public readonly call        : ObserverCall<T>,
        /** The duration (in milliseconds) specified as the delay before rendering the view. */
        public readonly showAfter   : number,
        /** The duration (in milliseconds) specified as the delay before destroying the view. */
        public readonly showFor     : number,
        /**
         * The timestamp at which the view should be rendered. This value is manually specified and not calculated automatically using
         * `Date.now()` upon state creation because states might be recreated before the {@link showAfter} delay is finished.
         * When a state is recreated, the time that has already passed should be considered, thus the previous value should be used. 
          */
        public readonly renderAt    : number,
        /** (Optional) The rendered view. Will be provided only after the recreation of the state once the delay has passed. */
        public readonly view?       : RenderedView<T> | null,
    ) { }

    /**
     * The timestamp at which the view should be destroyed.
     *
     * @readonly
     * @type {number}
     */
    public get destroyAt (): number  { return this.renderAt + this.showFor; }
    /**
     * `true` if the state represents a view that is currently rendered; otherwise `false`.
     *
     * @readonly
     * @type {boolean}
     */
    public get isRendered(): boolean { return !!this.view; }
    /**
     * `true` if the state represents a view that should be auto-destroyed; otherwise `false`.
     *
     * @readonly
     * @type {boolean}
     */
    public get shouldAutoDestroy(): boolean { return this.showFor > 0; }

    /**
     * Creates a new state representing a new, fresh, commitment to render.
     * Should be used in multi-view mode, or in single-view mode when there is nothing rendered.
     *
     * @static
     * @template T The type of value emitted by the observable.
     * @param {ObserverCall<T>} call The intercepted call which triggered this state.
     * @param {number} showAfter The duration (in milliseconds) to wait before rendering the view.
     * @param {number} showFor The duration (in milliseconds) to wait before destroying the view.
     * @return {ViewRenderCommitment<T>} A new state representing fresh commitment to render.
     */
    static create<T>(call: ObserverCall<T>, showAfter: number, showFor: number): ViewRenderCommitment<T>
    {
        const now = Date.now();

        return new ViewRenderCommitment(now.toString(), call, showAfter, showFor, now + showAfter);
    }

    /**
     * Clones the state and replaces the call which triggered it.
     * Should be used in single-view mode when the view is already rendered and a new call is intercepted to make sure the
     * latest emitted value is specified.
     *
     * @static
     * @template T The type of value emitted by the observable.
     * @param {ViewRenderCommitment<T>} state The state to clone.
     * @param {ObserverCall<T>} call The intercepted call which triggered this state.
     * @return {ViewRenderCommitment<T>} A new state representing an updated commitment to render.
     */
    static update<T>(state: ViewRenderCommitment<T>, call: ObserverCall<T>): ViewRenderCommitment<T>
    {
        const now = Date.now();

        return new ViewRenderCommitment(state.commitmentId, call, state.showAfter, state.showFor, now + state.showAfter, state.view);
    }

    /**
     * Clones the state and assigns it with a recently rendered view.
     * Should be used whenever a view is rendered.
     *
     * @static
     * @template T The type of value emitted by the observable.
     * @param {ViewRenderCommitment<T>} state The state to clone.
     * @param {RenderedView<T>} view The rendered view to store in the state.
     * @return {ViewRenderCommitment<T>} A new state with the rendered view.
     */
    static rendered<T>(state: ViewRenderCommitment<T>, view: RenderedView<T>): ViewRenderCommitment<T>
    {
        return new ViewRenderCommitment(state.commitmentId, state.call, state.showAfter, state.showFor, state.renderAt, view);
    }
}

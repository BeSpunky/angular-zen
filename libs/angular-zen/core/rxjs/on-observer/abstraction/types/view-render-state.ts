import { RenderedView } from './general';
import { ObserverCall } from './observer-call';

export class ViewRenderState<T> {
    constructor(
        public readonly commitmentId: string,
        public readonly call        : ObserverCall<T>,
        public readonly showAfter   : number,
        public readonly showFor     : number,
        public readonly renderAt    : number,
        public readonly view?       : RenderedView<T> | null,
    ) { }

    public get destroyAt (): number  { return this.renderAt + this.showFor; }
    public get isRendered(): boolean { return !!this.view; }

    static create<T>(call: ObserverCall<T>, showAfter: number, showFor: number): ViewRenderState<T>
    {
        const now = Date.now();

        return new ViewRenderState(now.toString(), call, showAfter, showFor, now + showAfter);
    }

    static update<T>(state: ViewRenderState<T>, call: ObserverCall<T>): ViewRenderState<T>
    {
        return new ViewRenderState(state.commitmentId, call, state.showAfter, state.showFor, state.renderAt, state.view);
    }

    static rendered<T>(state: ViewRenderState<T>, view: RenderedView<T>): ViewRenderState<T>
    {
        return new ViewRenderState(state.commitmentId, state.call, state.showAfter, state.showFor, state.renderAt, view);
    }
}

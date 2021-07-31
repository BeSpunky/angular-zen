import { ObserverName, TimeBreakdown } from './general';
import { ViewRenderState             } from './view-render-state';

export class OnObserverContext<TResolved>
{
    [key: string]: unknown;

    public readonly $implicit?: TResolved;

    constructor(
                        selector   : string,
        public readonly index      : number,
        public readonly lastCall   : ObserverName,
                        value?     : TResolved,
        public readonly showingFor?: TimeBreakdown
    )
    {
        this.$implicit = this[selector] = value;
    }

    static fromState<T>(onObserverSelector: string, index: number, { call: { name, value } }: ViewRenderState<T>): OnObserverContext<T>
    {
        return new OnObserverContext(onObserverSelector, index, name, value);
    }
};

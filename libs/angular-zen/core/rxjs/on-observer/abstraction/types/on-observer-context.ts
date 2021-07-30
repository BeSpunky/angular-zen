import { ViewRenderState } from '../on-observer-base.directive';
import { ObserverName, TimeBreakdown } from './general';

export class OnObserverContext<TResolved>
{
    [key: string]: unknown;

    public readonly $implicit?: TResolved;

    constructor(
                        selector   : string,
        public readonly lastCall   : ObserverName,
                        value?     : TResolved,
        public readonly showingFor?: TimeBreakdown
    )
    {
        this.$implicit = this[selector] = value;
    }

    static fromRenderState<T>(onObserverSelector: string, { call: { name, value } }: ViewRenderState<T>): OnObserverContext<T>
    {
        return new OnObserverContext(onObserverSelector, name, value);
    }
};

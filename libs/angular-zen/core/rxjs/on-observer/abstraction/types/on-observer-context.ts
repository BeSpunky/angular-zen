import { ObserverState, TimeBreakdown } from './general';

export class OnObserverContext<TResolved>
{
    [key: string]: unknown;

    public readonly $implicit?: TResolved;

    constructor(
                        selector   : string,
        public readonly lastState  : ObserverState,
                        value?     : TResolved,
        public readonly showingFor?: TimeBreakdown
    )
    {
        this.$implicit = this[selector] = value;
    }
};

import { ObserverState, TimeBreakdown } from './general';

export class OnObserverContext<TResolved>
{
    [key: string]: unknown;

    public readonly $implicit: TResolved;

    constructor(
               value      : TResolved,
               selector   : string,
        public lastState  : ObserverState,
        public showingFor?: TimeBreakdown
    )
    {
        this.$implicit = this[selector] = value;
    }
};

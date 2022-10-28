import { Observable } from 'rxjs';

import type { OnObserverBaseDirective } from '../../../on-observer/abstraction/on-observer-base.directive';

/** Represents the context of an `*observeXXX` directive. */
export type ResolvedObserveContext<TResolved> = {
    [key: string]: unknown;
    
    $implicit: TResolved;
    /**
     * The multicasted observable exposed to the template. Can be used along with {@link OnObserverBaseDirective *onObserver} directives to
     * use the same stream.
     *
     * @type {Observable<TResolved>}
     */
    source   : Observable<TResolved>;
};

/** Represents a type that extracts the type of value an observable emits. */
export type EmittedTypeOf<T> = T extends Observable<infer TResolved> ? TResolved : never;
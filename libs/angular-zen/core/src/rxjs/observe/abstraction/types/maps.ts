import { Observable } from 'rxjs';

import { ResolvedObserveContext } from './general';

/** Represents a map of observable values. */
export type ObservableMap = { [key: string]: Observable<unknown> };

/**
 * Constructs a type out of an observable map, where keys are the same keys as the ones of an observable map, and values the
 * type of values emitted by the observable at the respective key.
 * 
 * For example:
 * 
 * ```ts
 * EmittedMapOf<{ x: Observable<number>, y: Observable<string> }>
 * ```
 * 
 * will create the following type:
 * ```ts
 * { x: number, y: string }
 * ```
 */
export type EmittedMapOf<T extends ObservableMap> = {
    [key in keyof T]: T[key] extends Observable<infer TResolved> ? TResolved : never
};

/**
 * Represents the type of context a used by `*observeXXX` directives which observe a map of observable values.
 * 
 * Emitted values will be available as the implicit context values but will also be spread into the context by key.
 * Meaning, this would work:
 * ```html
 * <div *observeXXX="{ x: x$, y: y$ } as result">{{result.x}}</div>
 * ```
 * 
 * And this also:
 * ```
 * <div *observeXXX="{ x: x$, y: y$ }; let x = x">{{x}}</div>
 * ```
 */
export type ObserveMapContext<T extends ObservableMap> = ResolvedObserveContext<EmittedMapOf<T>> & EmittedMapOf<T>;


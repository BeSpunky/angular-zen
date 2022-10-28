import { Observable } from 'rxjs';

/** Represents an array of observables. */
export type ObservableArray = Observable<unknown>[];

/** Constructs an tuple in which each element type is the type of value emitted by the observable at the corresponding index. */
export type EmittedArrayTypesOf<T> = T extends Observable<infer Observerd>[] ? Observerd : never;

// export type ObservableTupleOf<T extends unknown[]> =
//     T extends [infer T0, ...(infer TRest)]
//         ? TRest['length'] extends 0
//             ? [Observable<T0>] 
//             : [Observable<T0>, ...ObservableTupleOf<TRest>]
//         : never;

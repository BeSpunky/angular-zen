import { Observable } from 'rxjs';

export type ObservableArray = Observable<unknown>[];

export type EmittedArrayTypesOf<T> = T extends Observable<infer Observerd>[] ? Observerd : never;

// export type ObservableTupleOf<T extends unknown[]> =
//     T extends [infer T0, ...(infer TRest)]
//         ? TRest['length'] extends 0
//             ? [Observable<T0>] 
//             : [Observable<T0>, ...ObservableTupleOf<TRest>]
//         : never;

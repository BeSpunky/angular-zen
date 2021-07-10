import { Observable } from 'rxjs';
import { map        } from 'rxjs/operators';

import { ObservableMap, EmittedMapOf } from '../abstraction/types/maps';

/**
 * TODO: TEMP IMPLEMENTATION. WHEN ANGULAR GOES TO RXJS V7 REPLACE THIS WITH A CALL TO THE NEW combineLatest()
 *       which allows passing in an object directly.
 *
 * @export
 * @template T
 * @param {ObservableMapOf<T>} input
 * @param {(observables: Observable<any>[]) => Observable<any[]>} observeArray
 * @returns
 */
 export function observeAsArray<T extends ObservableMap>(input: T, observeArray: (observables: Observable<unknown>[]) => Observable<any[]>): Observable<EmittedMapOf<T>>
 {
     const keyMap = Object.keys(input).reduce((map, key, index) => {
         map[index] = key;
         return map;
     }, {} as { [index: number]: keyof T });
 
     const observables = Object.keys(input).map(key => input[key]);
 
     return observeArray(observables).pipe(
         map(values => values.reduce((resolved: EmittedMapOf<T>, value, index) =>
         {
             resolved[keyMap[index]] = value;
             return resolved;
         }, {}))
     );
 }
 
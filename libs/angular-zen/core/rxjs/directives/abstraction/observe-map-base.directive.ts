import { Observable } from 'rxjs';
import { map                       } from 'rxjs/operators';
import { Directive                 } from '@angular/core';

import { ObserveContext, ObserveBaseDirective } from './observe-base.directive';

export type Map = { [key: string]: unknown };

export type ObservableMapOf<T extends Map> = { [key in keyof T]: Observable<T[key]> };

export type ObserveMapContext<T extends Map> = ObserveContext<T> & T;

@Directive()
export abstract class ObserveMapDirective<T extends Map>
              extends ObserveBaseDirective<ObservableMapOf<T>, T, ObserveMapContext<T>>
{
    protected createViewContext(value: T): ObserveMapContext<T>
    {
        return { $implicit: value, ...value };
    }
}

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
 export function observeAsArray<T extends Map>(input: ObservableMapOf<T>, observeArray: (observables: Observable<any>[]) => Observable<any[]>)
 {
     const keyMap = Object.keys(input).reduce((map, key, index) => {
         map[index] = key;
         return map;
     }, {} as { [index: number]: keyof T });
 
     const observables = Object.keys(input).map(key => input[key]);
 
     return observeArray(observables).pipe(
         map(values => values.reduce((resolved, value, index) =>
         {
             resolved[keyMap[index]] = value;
             return resolved;
         }, {} as T))
     );
 }
 
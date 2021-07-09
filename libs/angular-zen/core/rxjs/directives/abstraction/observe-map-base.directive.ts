import { Observable } from 'rxjs';
import { map                       } from 'rxjs/operators';
import { Directive                 } from '@angular/core';

import { ObserveContext, ObserveBaseDirective } from './observe-base.directive';

export type ObservableMap = { [key: string]: Observable<unknown> };

export type EmittedTypesOf<T extends ObservableMap> = {
    [key in keyof T]: T[key] extends Observable<infer TResolved> ? TResolved : never
};

export type ObserveMapContext<T extends ObservableMap> = ObserveContext<EmittedTypesOf<T>> & EmittedTypesOf<T>;

@Directive()
export abstract class ObserveMapDirective<T extends { [key: string]: Observable<unknown> }>
              extends ObserveBaseDirective<T, EmittedTypesOf<T>, ObserveMapContext<T>>
{
    protected createViewContext(value: EmittedTypesOf<T>): ObserveMapContext<T>
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
 export function observeAsArray<T extends ObservableMap>(input: T, observeArray: (observables: Observable<unknown>[]) => Observable<any[]>): Observable<EmittedTypesOf<T>>
 {
     const keyMap = Object.keys(input).reduce((map, key, index) => {
         map[index] = key;
         return map;
     }, {} as { [index: number]: keyof T });
 
     const observables = Object.keys(input).map(key => input[key]);
 
     return observeArray(observables).pipe(
         map(values => values.reduce((resolved: EmittedTypesOf<T>, value, index) =>
         {
             resolved[keyMap[index]] = value;
             return resolved;
         }, {}))
     );
 }
 
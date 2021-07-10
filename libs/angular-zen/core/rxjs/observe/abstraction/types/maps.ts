import { Observable } from 'rxjs';

import { ObserveContext } from './general';

export type ObservableMap = { [key: string]: Observable<unknown> };

export type EmittedMapOf<T extends ObservableMap> = {
    [key in keyof T]: T[key] extends Observable<infer TResolved> ? TResolved : never
};

export type ObserveMapContext<T extends ObservableMap> = ObserveContext<EmittedMapOf<T>> & EmittedMapOf<T>;


import { Observable } from 'rxjs';

import { ResolvedObserveContext } from './general';

export type ObservableMap = { [key: string]: Observable<unknown> };

export type EmittedMapOf<T extends ObservableMap> = {
    [key in keyof T]: T[key] extends Observable<infer TResolved> ? TResolved : never
};

export type ObserveMapContext<T extends ObservableMap> = ResolvedObserveContext<EmittedMapOf<T>> & EmittedMapOf<T>;


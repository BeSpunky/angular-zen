import { Observable } from 'rxjs';

export type ResolvedObserveContext<TResolved> = {
    $implicit: TResolved;
    source   : Observable<TResolved>;
};

export type EmittedTypeOf<T> = T extends Observable<infer TResolved> ? TResolved : never;
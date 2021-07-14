import { Observable } from 'rxjs';

export type ResolvedObserveContext<TResolved> = {
    [key: string]: unknown;
    
    $implicit: TResolved;
    source   : Observable<TResolved>;
};

export type EmittedTypeOf<T> = T extends Observable<infer TResolved> ? TResolved : never;
import { Observable } from 'rxjs';

export type ObserveContext<TResolved> = { $implicit: TResolved };

export type EmittedTypeOf<T> = T extends Observable<infer TResolved> ? TResolved : never;

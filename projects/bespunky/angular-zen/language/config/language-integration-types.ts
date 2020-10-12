import { InteropObservable, Observable } from 'rxjs';

export type ObservableLike<T> = InteropObservable<T> | Observable<T> | Promise<T>;

export type SupportedLanguagesFactory = () => ObservableLike<string[]>;
export type DefaultLanguageFactory    = () => ObservableLike<string>;
export type TranslationFn             = (value: string, params?: any) => string;

import { InteropObservable, Observable } from 'rxjs';

/** Represents resolvable async objects. */
export type ObservableLike<T> = InteropObservable<T> | Observable<T> | Promise<T>;

/** Represents a factory that produces a resolvable async object for fetching all languages supported by the integrated app. */
export type SupportedLanguagesFactory = () => ObservableLike<string[]>;
/** Represents a factory that produces a resolvable async object for fetching the default language used by the integrated app. */
export type DefaultLanguageFactory    = () => ObservableLike<string>;
/** Represents a translation function that receives a value (typically a translation id) and translation params, then returns the translation in the current language. */
export type TranslationFn             = (value: string, params?: Record<string, unknown>) => string;

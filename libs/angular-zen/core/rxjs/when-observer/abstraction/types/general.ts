import { PartialObserver } from 'rxjs';

export type ObserverHandler = Exclude<keyof PartialObserver<unknown>, 'closed'>;

export type DurationUnit       = 'ms' | 's' | 'm';
export type DurationAnnotation = number | `${ number }${ DurationUnit }`;

export type WhenObserverBaseContext<T> = {
    $implicit    : T;
    lastCall     : ObserverHandler;
    showingForMs?: number;
};

export type WhenObserverResolvingContext<T>  = WhenObserverBaseContext<T>;
export type WhenObserverErrorContext<TError> = WhenObserverBaseContext<TError>;
export type WhenObserverCompletedContext     = WhenObserverBaseContext<never>;

export type WhenObserverContext<T> = WhenObserverResolvingContext<T> | WhenObserverErrorContext<T> | WhenObserverCompletedContext;
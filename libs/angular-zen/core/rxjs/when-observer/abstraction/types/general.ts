export type ObserverState = 'resolving' | 'completed' | 'error';

export type DurationUnit       = 'ms' | 's' | 'm';
export type DurationAnnotation = number | `${ number }${ DurationUnit }`;

export type WhenObserverBaseContext<T> = {
    $implicit    : T;
    state        : ObserverState;
    keepingForMs?: number;
};

export type WhenObserverResolvingContext<T>  = WhenObserverBaseContext<T>;
export type WhenObserverErrorContext<TError> = WhenObserverBaseContext<TError>;
export type WhenObserverCompletedContext     = WhenObserverBaseContext<never>;

export type WhenObserverContext<T> = WhenObserverResolvingContext<T> | WhenObserverErrorContext<T> | WhenObserverCompletedContext;
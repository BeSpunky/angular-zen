export type ObserverState = 'resolving' | 'completed' | 'error';

export type DurationUnit       = 'ms' | 's' | 'm';
export type DurationAnnotation = number | `${ number }${ DurationUnit }`;

export type OnObserverBaseContext<T> = {
    $implicit     : T;
    state         : ObserverState;
    keepingForSec?: number;
    keepingForMs? : number;
};

export type OnObserverResolvingContext<T>  = OnObserverBaseContext<T>;
export type OnObserverErrorContext<TError> = OnObserverBaseContext<TError>;
export type OnObserverCompletedContext     = OnObserverBaseContext<never>;

export type OnObserverContext<T> = OnObserverResolvingContext<T> | OnObserverErrorContext<T> | OnObserverCompletedContext;
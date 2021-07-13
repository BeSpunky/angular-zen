import { PartialObserver } from 'rxjs';

export type ObserverHandler = Exclude<keyof PartialObserver<unknown>, 'closed'>;

export type DurationUnit       = 'ms' | 's' | 'm';
export type DurationAnnotation = number | `${ number }${ DurationUnit }`;

export type TimeBreakdown = Record<DurationUnit, number>;

export type OnObserverBaseContext<T> = {
    $implicit  : T;
    onObserver : T;
    lastCall   : ObserverHandler;
    showingFor?: TimeBreakdown;
};

export type OnObserverResolvingContext<T>  = OnObserverBaseContext<T>;
export type OnObserverErrorContext<TError> = OnObserverBaseContext<TError>;
export type OnObserverCompletedContext     = OnObserverBaseContext<never>;

export type OnObserverContext<T> = OnObserverResolvingContext<T> | OnObserverErrorContext<T> | OnObserverCompletedContext;
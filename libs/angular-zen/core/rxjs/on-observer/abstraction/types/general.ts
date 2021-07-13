import { PartialObserver } from 'rxjs';

export type ObserverCall = Exclude<keyof PartialObserver<unknown>, 'closed'>;

export type ObserverState = ObserverCall | 'resolving';

export type DurationUnit       = 'ms' | 's' | 'm';
export type DurationAnnotation = number | `${ number }${ DurationUnit }`;

export type TimeBreakdown = Record<DurationUnit, number>;

import { PartialObserver } from 'rxjs';

export type ObserverName = 'resolving' | Exclude<keyof PartialObserver<unknown>, 'closed'>;

export type DurationUnit       = 'ms' | 's' | 'm';
export type DurationAnnotation = number | `${ number }${ DurationUnit }`;

export type TimeBreakdown = Record<DurationUnit, number> & Record<`total${ 'Milliseconds' | 'Seconds' | 'Minutes' }`, number>;
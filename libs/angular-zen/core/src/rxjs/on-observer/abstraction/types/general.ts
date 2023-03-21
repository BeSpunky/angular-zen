import { PartialObserver } from 'rxjs';
import { EmbeddedViewRef } from '@angular/core';

import { OnObserverContext    } from './on-observer-context';
import { ViewRenderCommitment } from './view-render-commitment';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import type { OnObserverBaseDirective } from '../on-observer-base.directive';

/** Represents the name of an observer call. */
export type ObserverName = 'resolving' | Exclude<keyof PartialObserver<unknown>, 'closed'>;

/** Represents supported duration units. */
export type DurationUnit = 'ms' | 's' | 'm';
/** Represents duration as a number, which will be treated as milliseconds, or a string with the format of `<number><ms | s | ms>`.
 * Numbers can be either integers or floats.
 * For example:
 * - `3000` - 3 seconds.
 * - `'10s'` - 10 seconds.
 * - `'0.5m'` - 30 seconds.
 * - `'100ms'` - 100 milliseconds.
 */
export type DurationAnnotation = number | `${ number }${ DurationUnit }`;

/** Represents a duration, broken into its components. */
export type DurationBreakdown = Record<DurationUnit, number> & Record<`total${ 'Milliseconds' | 'Seconds' | 'Minutes' }`, number>;

/** Represents a view rendered by an {@link OnObserverBaseDirective `*onObserver`} directive. */
export type RenderedView<T> = EmbeddedViewRef<OnObserverContext<T>>;

/** Represents a map of render commitments holding the information about what views to render and when. */
export type RenderCommitmentMap<T> = Map<string, ViewRenderCommitment<T>>;

/** Represents the supported view modes for {@link OnObserverBaseDirective `*onObserver`} directives. */
export type ViewMode = 'multiple' | 'single';
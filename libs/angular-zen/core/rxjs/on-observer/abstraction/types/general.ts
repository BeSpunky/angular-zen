import { PartialObserver } from 'rxjs';
import { EmbeddedViewRef } from '@angular/core';

import { OnObserverContext } from './on-observer-context';
import { ViewRenderState } from './view-render-state';

export type ObserverName = 'resolving' | Exclude<keyof PartialObserver<unknown>, 'closed'>;

export type DurationUnit       = 'ms' | 's' | 'm';
export type DurationAnnotation = number | `${ number }${ DurationUnit }`;

export type TimeBreakdown = Record<DurationUnit, number> & Record<`total${ 'Milliseconds' | 'Seconds' | 'Minutes' }`, number>;

export type RenderedView<T> = EmbeddedViewRef<OnObserverContext<T>>;

export type ViewStateMap<T> = Map<string, ViewRenderState<T>>;

export type ViewMode = 'multiple' | 'single';
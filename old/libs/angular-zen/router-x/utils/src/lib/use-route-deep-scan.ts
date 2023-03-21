import { Observable, switchMap } from 'rxjs';
import { inject } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, NavigationEnd } from '@angular/router';
import { RouterOutletComponentBus } from '@bespunky/angular-zen/router-x';
import { AnyObject } from '@bespunky/typescript-utils';
import { useRouterEvent } from './use-router-event';

export interface RouteProcessResult
{
    /**
     * Used for optimizing the recursion of the deep route scanning operation by feeding it back with a 'stop' signal.
     *
     * @type {boolean}
     */
    done: boolean;
}

export interface ObservedRouteProcessResult<T> extends RouteProcessResult
{
    /**
     * Used for feeding a value from your process function back to the deep route scanning operation.
     * The scan operation will emit this value through the observable it returned.
     *
     * @type {T}
     */
    emit?: T;
}

export type RouteProcessFunction<TResult extends RouteProcessResult = RouteProcessResult> = (route: ActivatedRouteSnapshot, component?: AnyObject | null) => TResult;

export type ObservedRouteProcessFunction<TResult> = RouteProcessFunction<ObservedRouteProcessResult<TResult>>;

/**
 * Recoursively runs a processing function on the route and its children.
 * Scan is done from parent to child, meaning the parent is the first to process.
 *
 * @export
 * @param {(RouterOutletComponentBus | null)} componentBus The instance of the component bus.
 * @param {ActivatedRouteSnapshot} route The top route on which to apply the processing function. 
 * @param {RouteProcessFunction} process The function to run on the route and its children.
 * The function receives a `route` argument which reflects the route being processed,
 * and a `component` argument which reflects the instance of the component loaded for the route's corresponsind outlet.
 * If the corresponding outlet wasn't marked with the `publishComponent` directive, the `component` argument will be null.
 * @param {number} [levels=-1] (Optional) The number of levels (excluding the parent) to dive deeper into the route tree.
 * A value of 1 for example, will process the route and its first-level children only. By default, scans all levels of the route tree.
 */
export function deepScanRoute(
    componentBus: RouterOutletComponentBus | null,
    route: ActivatedRouteSnapshot,
    process: RouteProcessFunction,
    levels: number = -1
): void
{
    // Make sure the caller wants scan to proceed, then make sure level limit wasn't reached.
    const processing = process(route, componentBus?.instance(route.outlet));

    // Negative values will scan all, positives will scan until reaching zero.
    const shouldScanChildren = !processing.done && levels !== 0;
    
    if (shouldScanChildren && route.children) route.children.forEach(childRoute => deepScanRoute(componentBus, childRoute, process, levels - 1));
}

function observeRouteDeepScan<TReturn>(route: ActivatedRouteSnapshot, componentBus: RouterOutletComponentBus | null, process: ObservedRouteProcessFunction<TReturn>, levels?: number): Observable<TReturn>
{
    return new Observable(({ next, error, complete }) =>
    {
        const processAndEmit = (...args: Parameters<ObservedRouteProcessFunction<TReturn>>) =>
        {
            const result = process(...args);
    
            if (result.emit) next(result.emit);
    
            return result;
        };

        try
        {
            deepScanRoute(componentBus, route, processAndEmit, levels);
        }
        catch (e)
        {
            error(e);
        }
        finally
        {
            complete();
        }
    });
}

/**
 * Creates an observable which, upon navigation end, deep scans the activated route by running the provided
 * processing function.
 *
 * @export
 * @template TResult The type of the value emitted by the provided processing function.
 * @param {ObservedRouteProcessFunction<TResult>} process The function to run on the activated route and its children.
 * @param {number} [levels=-1] (Optional) The number of levels (excluding the parent) to dive deeper into the route tree.
 * A value of 1 for example, will process the route and its first-level children only. By default, scans all levels of the route tree.
 * @return {Observable<TResult>} An observable which, upon navigation end, deep scans the activated route by running the provided
 * processing function.
 */
export function useRouteDeepScan<TResult>(process: ObservedRouteProcessFunction<TResult>, levels: number = -1): Observable<TResult>
{
    const route        = inject(ActivatedRoute);
    const componentBus = inject(RouterOutletComponentBus);

    return useRouterEvent(NavigationEnd).pipe(
        switchMap(() => observeRouteDeepScan(route.snapshot, componentBus, process, levels))
    );
}
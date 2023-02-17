import { ObservableLike } from '@bespunky/rxjs';
import { AnyObject } from '@bespunky/typescript-utils';
import { concat, finalize, first, forkJoin, Observable, switchMap, toArray } from 'rxjs';
import { useActivatedRouteComponent } from './use-router-outlet-tracker';

declare const Zone: any;

/** Represents a function that creates an async task to be run (normally on a component). */
export type Resolver<
    Component extends AnyObject | null,
    ResolverArgs extends readonly [...unknown[]],
    Observed
> = (component: Component, ...resolverArgs: readonly [...ResolverArgs]) => ObservableLike<Observed>;

type ResolvedTuple<
    Resolvers extends readonly [...Resolver<any, any, any>[]]
> =
    Resolvers extends readonly [Resolver<any, any, infer Observed>, ...infer Rest]
    ? Rest extends readonly Resolver<any, any, any>[]
        ? [Observed, ...ResolvedTuple<Rest>]
        : never
    : [];

type InComponentResolveFunction = <
    Component extends AnyObject | null,
    ResolverArgs extends readonly [...unknown[]],
    Resolvers extends readonly [...Resolver<Component, ResolverArgs, unknown>[]]
>(activatedRouteComponent: Component, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]) => Observable<ResolvedTuple<Resolvers>>
;

type ResolverInvoker = <
    ResolverArgs extends readonly [...unknown[]],
    Resolvers extends readonly [...Resolver<AnyObject | null, ResolverArgs, unknown>[]]
>(args: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]) => Observable<ResolvedTuple<Resolvers>>

/**
 * The prefix of the id generated for zone macro tasks when calling `RouteAware.resolveInMacroTask()`.
 * 
 * Generated ids will confrom to a `{prefix}-{random number}` format.
 */
export const ResolverMacroTaskIdPrefix = 'route-aware-resolver';

/**
 * Creates an observable that runs all the specified resolvers and concats their results as an array.
 * The resolvers will be passed with the instance of the component for the currently activated route.
 *
 * @function
 * @param {AnyObject | null} activatedRouteComponent 
 * @param {(Resolver | Resolver[])} resolvers The resolver(s) to concat.
 * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers in addition to the component.
 * @returns {Observable<any[]>} An array with the concatenated results of the resolvers.
 */


function invokeResolvers<
    Component extends AnyObject | null,
    ResolverArgs extends readonly unknown[],
    Resolvers extends readonly Resolver<Component, ResolverArgs, unknown>[]
>(activatedRouteComponent: Component, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): ResolvedTuple<typeof resolvers>
{
    return resolvers.map((resolve) => resolve(activatedRouteComponent, ...(resolverArgs ?? []))) as ResolvedTuple<typeof resolvers>;
}

function resolve<
    Component extends AnyObject | null,
    ResolverArgs extends readonly unknown[],
    Resolvers extends readonly Resolver<Component, ResolverArgs, unknown>[]
>(activatedRouteComponent: Component, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): Observable<ResolvedTuple<Resolvers>>
{
    // Run resolvers to create observable tasks
    const observables = invokeResolvers(activatedRouteComponent, resolverArgs, resolvers);

    // Run tasks and output their returned data as an array
    return concat(...observables as Observable<unknown>[]).pipe(toArray()) as Observable<ResolvedTuple<Resolvers>>;
}

function resolveParallel<
    Component extends AnyObject | null,
    ResolverArgs extends readonly unknown[],
    Resolvers extends readonly Resolver<Component, ResolverArgs, unknown>[]
>(activatedRouteComponent: Component, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): Observable<ResolvedTuple<Resolvers>>
{
    // Run resolvers to create observable tasks
    const observables = invokeResolvers(activatedRouteComponent, resolverArgs, resolvers);

    // Run tasks and output their returned data as an array
    return forkJoin(observables) as Observable<ResolvedTuple<Resolvers>>;
}

function wrapInMacroTask<T>(observable: Observable<T>): Observable<T>
{
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const macroTask = Zone.current.scheduleMacroTask(`${ ResolverMacroTaskIdPrefix }-${ Math.random() }`, () => {}, {}, () => {}, () => {});

    // Signal end of macro task on completion or error and allow server to return
    return observable.pipe(finalize(() => macroTask.invoke()));
}

/**
 * Creates an observable that runs all the specified resolvers and concats their results as an array.
 * The resolvers will be passed with the instance of the component for the currently activated route.
 * 
 * **Angular Universal:**
 * In SSR, the server doesn't wait for async code to complete. The result is scrapers and search engines receiving a page without resolved data,
 * which is bad in case you need them to read some resolved metadata tags for example.
 * 
 * Using `Zone` directly, this method creates a macro task and completes it when resolves are done or have errored.
 * This makes the server block and wait until everything is resolved or errors before returning the rendered page.
 * 
 * > *ℹ Make sure your resolves and process function are fast enough so that the server won't hang too much trying to render.*
 *
 * @see https://stackoverflow.com/a/50065783/4371525 for the discussion.
 *
 * @see {ResolverMacroTaskIdPrefix} if you need to identify the created macro task in your code.
 * 
 * @function
 * @param {AnyObject | null} activatedRouteComponent 
 * @param {(Resolver | Resolver[])} resolvers The resolver(s) to concat.
 * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers in addition to the component.
 */
function resolveInMacroTask<
    Component extends AnyObject | null,
    ResolverArgs extends readonly unknown[],
    Resolvers extends readonly Resolver<Component, ResolverArgs, unknown>[]
>(activatedRouteComponent: Component, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): Observable<ResolvedTuple<Resolvers>>
{
    return wrapInMacroTask(resolve(activatedRouteComponent, resolverArgs, resolvers));
}

/**
 * Creates an observable that runs all the specified resolvers and concats their results as an array.
 * The resolvers will be passed with the instance of the component for the currently activated route.
 * 
 * **Angular Universal:**
 * In SSR, the server doesn't wait for async code to complete. The result is scrapers and search engines receiving a page without resolved data,
 * which is bad in case you need them to read some resolved metadata tags for example.
 * 
 * Using `Zone` directly, this method creates a macro task and completes it when resolves are done or have errored.
 * This makes the server block and wait until everything is resolved or errors before returning the rendered page.
 * 
 * > *ℹ Make sure your resolves and process function are fast enough so that the server won't hang too much trying to render.*
 *
 * @see https://stackoverflow.com/a/50065783/4371525 for the discussion.
 *
 * @see {ResolverMacroTaskIdPrefix} if you need to identify the created macro task in your code.
 * 
 * @function
 * @param {AnyObject | null} activatedRouteComponent 
 * @param {(Resolver | Resolver[])} resolvers The resolver(s) to concat.
 * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers in addition to the component.
 */
function resolveParallelInMacroTask<
    Component extends AnyObject | null,
    ResolverArgs extends readonly unknown[],
    Resolvers extends readonly Resolver<Component, ResolverArgs, unknown>[]
>(activatedRouteComponent: Component, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): Observable<ResolvedTuple<Resolvers>>
{
    return wrapInMacroTask(resolveParallel(activatedRouteComponent, resolverArgs, resolvers));
}

function _useInComponentResolves<ResolveFn extends InComponentResolveFunction>(resolveFn: ResolveFn): ResolverInvoker {
    const activatedRouteComponent = useActivatedRouteComponent();
    
    return (args, resolvers) => activatedRouteComponent.pipe(
        first(),
        switchMap(component => resolveFn(component, args, resolvers))
    );
}

export function useInComponentResolves() { return _useInComponentResolves(resolve); }
export function useInComponentResolvesMacroTask() { return _useInComponentResolves(resolveInMacroTask); }

export function useInComponentParallelResolves() { return _useInComponentResolves(resolveParallel); }
export function useInComponentParallelResolvesMacroTask() { return _useInComponentResolves(resolveParallelInMacroTask); }

/*
* I have to rethink this whole feature. What's the purpose? The original use case is when resolving requires the activate component from the components bus.
* That's the whole point. Otherwise, the developer can simply hook into the router and other tools to call a method
* and resolve things.
* 
* Also, the API should be more intuitive:
* 
* private resolve = useActivatedRouteComponentResolves();
* 
* somewhere()
* {
*    this.resolve({
*        item1: (component, route, value1, value2, value3) => ...,
*        item2: (component, route, value1, value2, value3) => ...,
*        $args: [value1, value2, value3]
*    });
* }
* 
* PS, seems like Angular v16 takes away the need for ZoneJs. Also, SSR is going to change.
* Consider removing the macro task resolvers.
* 
* Not releasing for now. Comminting this file out.
*/

// import { concat, filter, first, forkJoin, map, Observable, of, switchMap, toArray } from 'rxjs';
// import { ObservableLike } from '@bespunky/rxjs';
// import { AnyObject } from '@bespunky/typescript-utils';

// import { wrapInMacroTask } from './_wrap-in-macro-task';
// import { useActivatedRouteComponent } from './use-router-outlet-tracker';
// import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
// import { inject, Injectable } from '@angular/core';

// /** Represents a function that creates an async task to be run (normally on a component). */
// export type ResolverX<
//     Component extends AnyObject | null = AnyObject | null,
//     ResolverArgs extends readonly [...unknown[]] = readonly [...unknown[]],
//     Observed = unknown
// > = (activatedRouteComponent: Component, activatedRouteSnapshot: ActivatedRouteSnapshot, ...resolverArgs: readonly [...ResolverArgs]) => ObservableLike<Observed>;

// type ResolvedTuple<
//     Resolvers extends readonly [...ResolverX<any, any, any>[]]
// > =
//     Resolvers extends readonly [ResolverX<any, any, infer Observed>, ...infer Rest]
//     ? Rest extends readonly ResolverX<any, any, any>[]
//         ? [Observed, ...ResolvedTuple<Rest>]
//         : never
//     : [];

// type _ResolvesInvoker = <
//     Component extends AnyObject | null,
//     ResolverArgs extends readonly [...unknown[]],
//     Resolvers extends readonly [...ResolverX<Component, ResolverArgs, unknown>[]]
// >(activatedRouteComponent: Component, activatedRouteSnapshot: ActivatedRouteSnapshot, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]) => Observable<ResolvedTuple<Resolvers>>;

// type ResolvesInvoker = <
//     ResolverArgs extends readonly [...unknown[]],
//     Resolvers extends readonly [...ResolverX<AnyObject | null, ResolverArgs, unknown>[]]
// >(resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]) => Observable<ResolvedTuple<Resolvers>>

// /**
//  * The prefix of the id generated for zone macro tasks when calling `RouteAware.resolveInMacroTask()`.
//  * 
//  * Generated ids will confrom to a `{prefix}-{random number}` format.
//  */
// export const ResolverMacroTaskIdPrefix = 'route-aware-resolver';

// function invokeResolvers<
//     Component extends AnyObject | null,
//     ResolverArgs extends readonly unknown[],
//     Resolvers extends readonly ResolverX<Component, ResolverArgs, unknown>[]
// >(activatedRouteComponent: Component, activatedRouteSnapshot: ActivatedRouteSnapshot, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): ResolvedTuple<typeof resolvers>
// {
//     return resolvers.map((resolve) => resolve(activatedRouteComponent, activatedRouteSnapshot, ...(resolverArgs ?? []))) as ResolvedTuple<typeof resolvers>;
// }

// function resolve<
//     Component extends AnyObject | null,
//     ResolverArgs extends readonly unknown[],
//     Resolvers extends readonly ResolverX<Component, ResolverArgs, unknown>[]
// >(activatedRouteComponent: Component, activatedRouteSnapshot: ActivatedRouteSnapshot, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): Observable<ResolvedTuple<Resolvers>>
// {
//     // Run resolvers to create observable tasks
//     const observables = invokeResolvers(activatedRouteComponent, activatedRouteSnapshot, resolverArgs, resolvers);

//     // Run tasks and output their returned data as an array
//     return concat(...observables as Observable<unknown>[]).pipe(toArray()) as Observable<ResolvedTuple<Resolvers>>;
// }

// function resolveParallel<
//     Component extends AnyObject | null,
//     ResolverArgs extends readonly unknown[],
//     Resolvers extends readonly ResolverX<Component, ResolverArgs, unknown>[]
// >(activatedRouteComponent: Component, activatedRouteSnapshot: ActivatedRouteSnapshot, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): Observable<ResolvedTuple<Resolvers>>
// {
//     // Run resolvers to create observable tasks
//     const observables = invokeResolvers(activatedRouteComponent, activatedRouteSnapshot, resolverArgs, resolvers);

//     // Run tasks and output their returned data as an array
//     return forkJoin(observables) as Observable<ResolvedTuple<Resolvers>>;
// }

// /**
//  * Creates an observable that runs all the specified resolvers and concats their results as an array.
//  * The resolvers will be passed with the instance of the component for the currently activated route.
//  * 
//  * **Angular Universal:**
//  * In SSR, the server doesn't wait for async code to complete. The result is scrapers and search engines receiving a page without resolved data,
//  * which is bad in case you need them to read some resolved metadata tags for example.
//  * 
//  * Using `Zone` directly, this method creates a macro task and completes it when resolves are done or have errored.
//  * This makes the server block and wait until everything is resolved or errors before returning the rendered page.
//  * 
//  * > *ℹ Make sure your resolves and process function are fast enough so that the server won't hang too much trying to render.*
//  *
//  * @see https://stackoverflow.com/a/50065783/4371525 for the discussion.
//  *
//  * @see {ResolverMacroTaskIdPrefix} if you need to identify the created macro task in your code.
//  * 
//  * @function
//  * @param {AnyObject | null} activatedRouteComponent 
//  * @param {(ResolverX | ResolverX[])} resolvers The resolver(s) to concat.
//  * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers in addition to the component.
//  */
// function resolveInMacroTask<
//     Component extends AnyObject | null,
//     ResolverArgs extends readonly unknown[],
//     Resolvers extends readonly ResolverX<Component, ResolverArgs, unknown>[]
// >(activatedRouteComponent: Component, activatedRouteSnapshot: ActivatedRouteSnapshot, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): Observable<ResolvedTuple<Resolvers>>
// {
//     return wrapInMacroTask(resolve(activatedRouteComponent, activatedRouteSnapshot, resolverArgs, resolvers), ResolverMacroTaskIdPrefix);
// }

// /**
//  * Creates an observable that runs all the specified resolvers and concats their results as an array.
//  * The resolvers will be passed with the instance of the component for the currently activated route.
//  * 
//  * **Angular Universal:**
//  * In SSR, the server doesn't wait for async code to complete. The result is scrapers and search engines receiving a page without resolved data,
//  * which is bad in case you need them to read some resolved metadata tags for example.
//  * 
//  * Using `Zone` directly, this method creates a macro task and completes it when resolves are done or have errored.
//  * This makes the server block and wait until everything is resolved or errors before returning the rendered page.
//  * 
//  * > *ℹ Make sure your resolves and process function are fast enough so that the server won't hang too much trying to render.*
//  *
//  * @see https://stackoverflow.com/a/50065783/4371525 for the discussion.
//  *
//  * @see {ResolverMacroTaskIdPrefix} if you need to identify the created macro task in your code.
//  * 
//  * @function
//  * @param {AnyObject | null} activatedRouteComponent 
//  * @param {(ResolverX | ResolverX[])} resolvers The resolver(s) to concat.
//  * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers in addition to the component.
//  */
// function resolveParallelInMacroTask<
//     Component extends AnyObject | null,
//     ResolverArgs extends readonly unknown[],
//     Resolvers extends readonly ResolverX<Component, ResolverArgs, unknown>[]
// >(activatedRouteComponent: Component, activatedRouteSnapshot: ActivatedRouteSnapshot, resolverArgs: readonly [...ResolverArgs], resolvers: readonly [...Resolvers]): Observable<ResolvedTuple<Resolvers>>
// {
//     return wrapInMacroTask(resolveParallel(activatedRouteComponent, activatedRouteSnapshot, resolverArgs, resolvers), ResolverMacroTaskIdPrefix);
// }

// function _useActivatedRouteComponentResolves<Invoker extends _ResolvesInvoker>(resolveFn: Invoker): ResolvesInvoker {
//     const activatedRouteComponent = useActivatedRouteComponent();
    
//     return (args, resolvers) => activatedRouteComponent.pipe(
//         switchMap(({ activatedComponent, activatedRouteSnapshot }) => resolveFn(activatedComponent, activatedRouteSnapshot, args, resolvers))
//     );
// }

// /**
//  * Hooks into the router and the router outlet component bus to allow post-navigation resolvers using the currently activated
//  * component.
//  * 
//  * Calling this function in an injection context will return a generator function which runs your resolvers every time the
//  * currently activate component changes, passing them the component instance.
//  * 
//  * @example ```
//  * import { useActivatedRouteComponentResolves, ResolverX } from '@bespunky/angular-zen/router-x/utils';
//  * 
//  * @Injectable({ ... })
//  * export class PrefetchService
//  * {
//  *     private route = inject(ActivatedRoute);
//  *     private resolve = useActivatedRouteComponentResolves();
//  *     
//  *     public hookPrefetch(): void
//  *     {
//  *         route.data.pipe(
//  *             filter((data): data is { prefetch: ResolverX } => 'prefetch' in data),
//  *             switchMap(({ prefetch }) => resolvee([route.snapshot], [prefetch]))
//  *         ).subscribe();
//  *     }
//  * 
//  *     
//  * }
//  * ``` 
//  * Creates an observable that runs all the specified resolvers and concats their results as an array.
//  * The resolvers will be passed with the instance of the component for the currently activated route.
//  * 
//  * **Angular Universal:**
//  * In SSR, the server doesn't wait for async code to complete. The result is scrapers and search engines receiving a page without resolved data,
//  * which is bad in case you need them to read some resolved metadata tags for example.
//  * 
//  * Using `Zone` directly, this method creates a macro task and completes it when resolves are done or have errored.
//  * This makes the server block and wait until everything is resolved or errors before returning the rendered page.
//  * 
//  * > *ℹ Make sure your resolves and process function are fast enough so that the server won't hang too much trying to render.*
//  *
//  * @see https://stackoverflow.com/a/50065783/4371525 for the discussion.
//  *
//  * @see {ResolverMacroTaskIdPrefix} if you need to identify the created macro task in your code.
//  * 
//  * @function
//  * @param {AnyObject | null} activatedRouteComponent 
//  * @param {(ResolverX | ResolverX[])} resolvers The resolver(s) to concat.
//  * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers in addition to the component.
//  */
// export function useActivatedRouteComponentResolves() { return _useActivatedRouteComponentResolves(resolve); }
// export function useActivatedRouteComponentResolvesMacroTask() { return _useActivatedRouteComponentResolves(resolveInMacroTask); }

// export function useActivatedRouteComponentParallelResolves() { return _useActivatedRouteComponentResolves(resolveParallel); }
// export function useActivatedRouteComponentParallelResolvesMacroTask() { return _useActivatedRouteComponentResolves(resolveParallelInMacroTask); }

// /// THINK OF AN EXAMPLE CASE FOR THE RESOLVES UTILS
// /// This prefetch example is close to what I'm looking for but it doesn't really reflect the need.
// /// Also, what's the point of calling `this.resolve` and deriving the pipe from there? It should be the end-game of the pipe...
// @Injectable()
// export class PrefetchService
// {
//     private resolve = useActivatedRouteComponentResolves();
 
//     public hookPrefetch(): void
//     {
//         this.resolve([], [
//             (component, route) => of(route.data).pipe(
//                 filter((data): data is { prefetch: ResolverX } => 'prefetch' in data),
//                 switchMap(({ prefetch }) => prefetch(component, route)))
//         ]).subscribe();
//     }
// }

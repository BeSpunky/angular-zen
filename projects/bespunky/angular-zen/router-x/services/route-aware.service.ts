import { from, InteropObservable, Observable, of                     } from 'rxjs';
import { concatAll, toArray                                          } from 'rxjs/operators';
import { Injectable                                                  } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, RouterEvent } from '@angular/router';
import { Destroyable                                                 } from '@bespunky/angular-zen/core';

import { RouterOutletComponentBus } from '../outlet/router-outlet-component-bus.service';

declare const Zone: any;

/** Represents a function that creates an async task to be run (normally on a component). */
export type Resolver = (component: any, ...resolverArgs: any[]) => Observable<any> | InteropObservable<any> | Promise<any>;

/**
 * Provides functionality for extending class to easily work with routes and process changes.
 *
 * @export
 * @abstract
 * @class RouteAwareService
 * @extends {Destroyable}
 */
@Injectable()
export abstract class RouteAwareService extends Destroyable
{
    /**
     * Creates an instance of RouteAwareService.
     * 
     * @param {Router} router The instance of Angular's router service.
     * @param {ActivatedRoute} route The instance of Angular's active route service.
     * @param {RouterOutletComponentBus} [componentBus] (Optional) The component bus for router-x functionality.
     * Provide this when you want your route-aware service to have access to the instance(s) of the activated component(s).
     */
    constructor(
        protected router       : Router,
        protected route        : ActivatedRoute,
        protected componentBus?: RouterOutletComponentBus
    )
    {
        super();

        this.subscribe(this.router.events, this.dispatchRouterEvent.bind(this));
    }
    
    /**
     * Checks if a handler method for the specific event type exists on the service and calls it.
     * Handler methods should comply with `onEventType` naming (lowercase 'on', first-upper event type).
     * 
     * @private
     * @param {RouterEvent} event The event data received from the router.
     */
    private dispatchRouterEvent(event: RouterEvent): void
    {
        const type   = (event as Object).constructor.name;
        const handle = this[`on${type}`];

        if (handle) handle(event);
    }

    /**
     * Recoursively runs a processing function on the route and its children.
     * Scan is done from parent to child, meaning the parent is the first to process.
     *
     * @protected
     * @param {ActivatedRouteSnapshot} route The top route on which to apply the processing function.
     * @param {(route: ActivatedRouteSnapshot, component: any) => void} process The function to run on the route and its children. The function receives a `route` argument which reflects the route being processed,
     * and a `component` argument which reflects the component that was loaded for the route's outlet.
     * If the corresponding outlet wasn't marked with the `publishComponent` directive, the `component` argument will be null.
     * @param {number} [levels=-1] (Optional) The number of levels (excluding the parent) to dive deeper into the route tree. By default, scans all levels of the route tree.
     * 
     * @example
     * ```typescript
     * const route   = ...; // Some route
     * const process = (route, component) => ...; // Some processing function
     * 
     * // The following will process the route and its first-level children only.
     * this.deepScanRoute(route, process, 1);
     * ```
     */
    protected deepScanRoute(route: ActivatedRouteSnapshot, process: (route: ActivatedRouteSnapshot, component: any) => void, levels: number = -1): void
    {
        process(route, this.componentBus?.instance(route.outlet));

        // Negative values will scan all, positives will scan until reaching zero
        const shouldScanNextLevel = levels !== 0;

        if (shouldScanNextLevel && route.children) route.children.forEach(childRoute => this.deepScanRoute(childRoute, process, levels - 1));
    }
    
    /**
     * Resolves the specified resolver(s) and passes the results as an array through the process function.
     * 
     * **Angular Universal:**
     * The method creates a zone macro task and completes it when processing is done.
     * In SSR mode, this makes the server wait until everything is resolved and processed
     * before returning the rendered page.
     * 
     * Make sure your resolves and process function are fast enough so that the server won't hang too much trying to render.
     *
     * @protected
     * @param {(Resolver | Resolver[])} resolvers The resolver(s) to resolve and process.
     * @param {(resolved: any) => void} process The process function to pass results array through.
     * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers.
     */
    protected resolveAndProcess(resolvers: Resolver | Resolver[], process: (resolved: any[]) => void, ...resolverArgs: any[]): void
    {
        // The server doesn't wait for async code to complete on SSR. The result is scapers and search engines receivng a page without metadata.
        // Using `Zone` this specifically tells the server that it should wait for task completion when metadata is already on the page.
        // See https://stackoverflow.com/a/50065783/4371525
        const macroTask = Zone.current.scheduleMacroTask('route-aware-resolver-' + Math.random(), () => { }, {}, () => { }, () => { });

        this.resolve(resolvers, ...resolverArgs).subscribe(
            process,
            // Log errors to console
            error => console.error(`Failed to resolve route data: ${error}`),
            // Signal end of macro task on completion and allow server to return
            () => macroTask.invoke()
        );
    }

    /**
     * Creates an observable that runs all the specified resolvers and concats their results as an array.
     * The resolvers will be passed with the instance of the component for the currently activated route.
     *
     * @protected
     * @param {(Resolver | Resolver[])} resolvers The resolver(s) to concat.
     * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers in addition to the component.
     * @returns {Observable<any[]>} An array with the concatenated results of the resolvers.
     */
    protected resolve(resolvers: Resolver | Resolver[], ...resolverArgs: any[]): Observable<any[]>
    {
        if (!resolvers) return of([]);

        // Cast array
        if (!Array.isArray(resolvers)) resolvers = [resolvers];

        // Run resolvers to create observable tasks
        const observables = resolvers.map(resolve => resolve(this.activatedRouteComponent, ...resolverArgs));
        
        // Run tasks and output their returned data as an array
        return from(observables).pipe(concatAll(), toArray());
    }

    /**
     * The instance of the component created for the currently activated route.
     * If no component bus was supplied at construction time, this will be `undefined`.
     *
     * @readonly
     * @protected
     * @type {(any | null)}
     */
    protected get activatedRouteComponent(): any | null
    {
        return this.componentBus?.instance(this.route.outlet);
    }
}

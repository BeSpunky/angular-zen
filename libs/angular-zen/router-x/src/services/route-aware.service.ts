import { from, InteropObservable, Observable, of         } from 'rxjs';
import { concatAll, filter, finalize, takeUntil, toArray } from 'rxjs/operators';
import { Directive, Type, Injectable                     } from '@angular/core';
import { Router, ActivatedRoute, ActivatedRouteSnapshot, Event, ActivationEnd, ActivationStart, ChildActivationEnd, ChildActivationStart, GuardsCheckEnd, GuardsCheckStart, NavigationCancel, NavigationEnd, NavigationError, NavigationStart, ResolveEnd, ResolveStart, RouteConfigLoadEnd, RouteConfigLoadStart, RoutesRecognized, Scroll } from '@angular/router';

import { Destroyable              } from '@bespunky/angular-zen/core';
import { RouterOutletComponentBus } from '../outlet/router-outlet-component-bus.service';

declare const Zone: any;

/**
 * Hard-codes event names as strings.
 * When AOT compilation is run and constructor names change, the dispatcher will still be able to get a hold
 * of the correct event name using this map.
 */
const EventMap = {
    [NavigationStart     .prototype.constructor.name]: 'NavigationStart',
    [RouteConfigLoadStart.prototype.constructor.name]: 'RouteConfigLoadStart',
    [RouteConfigLoadEnd  .prototype.constructor.name]: 'RouteConfigLoadEnd',
    [RoutesRecognized    .prototype.constructor.name]: 'RoutesRecognized',
    [GuardsCheckStart    .prototype.constructor.name]: 'GuardsCheckStart',
    [ChildActivationStart.prototype.constructor.name]: 'ChildActivationStart',
    [ActivationStart     .prototype.constructor.name]: 'ActivationStart',
    [GuardsCheckEnd      .prototype.constructor.name]: 'GuardsCheckEnd',
    [ResolveStart        .prototype.constructor.name]: 'ResolveStart',
    [ResolveEnd          .prototype.constructor.name]: 'ResolveEnd',
    [ChildActivationEnd  .prototype.constructor.name]: 'ChildActivationEnd',
    [ActivationEnd       .prototype.constructor.name]: 'ActivationEnd',
    [NavigationEnd       .prototype.constructor.name]: 'NavigationEnd',
    [NavigationCancel    .prototype.constructor.name]: 'NavigationCancel',
    [NavigationError     .prototype.constructor.name]: 'NavigationError',
    [Scroll              .prototype.constructor.name]: 'Scroll'
};

/** Represents a function that creates an async task to be run (normally on a component). */
export type Resolver = (component: any, ...resolverArgs: any[]) => Observable<any> | InteropObservable<any> | Promise<any>;

/**
 * The prefix of the id generated for zone macro tasks when calling `RouteAware.resolveInMacroTask()`.
 * 
 * Generated ids will confrom to a `{prefix}-{random number}` format.
 */
export const ResolverMacroTaskIdPrefix = 'route-aware-resolver';

/**
 * Provides functionality for extending class to easily work with routes and process changes.
 *
 * @export
 * @abstract
 * @class RouteAware
 * @extends {Destroyable}
 */
@Directive()  // Originally this was decorated with `Directive` only so angular accepts it as base for both services and components.
@Injectable() // However, compodoc fails to collect abstract classes marked with `Directive` so I marked it as both. Tests pass, POC stackblitz doesn't show side effects.
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export abstract class RouteAware extends Destroyable
{    
    /**
     * Creates an instance of RouteAware.
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

        // TODO: Scan class and only subscribe if handlers were defined
        this.subscribe(this.router.events, this.dispatchRouterEvent.bind(this));
    }
    
    /**
     * Checks if a handler method for the specific event type exists on the service and calls it.
     * Handler methods should comply with `onEventType` naming (lowercase 'on', first-upper event type).
     * 
     * @private
     * @param {Event} event The event data received from the router.
     */
    private dispatchRouterEvent(event: Event): void
    {
        // AOT compilation changes class names, causing the dispacher to look for a handler methods with
        // wrong names (e.g. `onJ`). The EventMap is used to restore the original names.
        const typeName    = event.constructor.name;
        const handlerName = `on${EventMap[typeName]}`;
        const handle      = (this as any)[handlerName];

        if (handle) handle.call(this, event);
    }

    /**
     * Creates an observable that emits only the specified router events and is automatically destroyed when the service/component is destroyed.
     *
     * @protected
     * @template TEvent The type of router event to emit.
     * @param {Type<TEvent>} eventType The type of router event to emit.
     * @param {boolean} [autoUnsubscribe=true] (Optional) `true` to make the observable complete when the service/component is destroyed; otherwise `false`. Default is `true`.
     * @returns {Observable<TEvent>}
     */
    protected observeRouterEvent<TEvent extends Event>(eventType: Type<TEvent>, autoUnsubscribe: boolean = true): Observable<TEvent>
    {
        let observable = this.router.events;

        if (autoUnsubscribe) observable = observable.pipe(takeUntil(this.destroyed));
        
        return observable.pipe(filter(event => event.constructor === eventType)) as Observable<TEvent>;
    }

    /**
     * Recoursively runs a processing function on the route and its children.
     * Scan is done from parent to child, meaning the parent is the first to process.
     *
     * @ignore
     * @protected
     * @param {ActivatedRouteSnapshot} route The top route on which to apply the processing function.
     * @param {(route: ActivatedRouteSnapshot, component: any) => boolean} process The function to run on the route and its children. The function receives a `route` argument which reflects the route being processed,
     * and a `component` argument which reflects the component that was loaded for the route's outlet.
     * If the corresponding outlet wasn't marked with the `publishComponent` directive, the `component` argument will be null.
     * 
     * Returning `true` from the process function is equal to saying 'work has completed' and will stop propogation to the route's children.
     * @param {number} [levels=-1] (Optional) The number of levels (excluding the parent) to dive deeper into the route tree.
     * A value of 1 for example, will process the route and its first-level children only. By default, scans all levels of the route tree.
     */
    protected deepScanRoute(route: ActivatedRouteSnapshot, process: (route: ActivatedRouteSnapshot, component: any) => boolean  , levels?: number): void;
    /**
     * Recoursively runs a processing function on the route and its children.
     * Scan is done from parent to child, meaning the parent is the first to process.
     *
     * @ignore
     * @protected
     * @param {ActivatedRouteSnapshot} route The top route on which to apply the processing function.
     * @param {(route: ActivatedRouteSnapshot, component: any) => void} process The function to run on the route and its children. The function receives a `route` argument which reflects the route being processed,
     * and a `component` argument which reflects the component that was loaded for the route's outlet.
     * If the corresponding outlet wasn't marked with the `publishComponent` directive, the `component` argument will be null.
     * 
     * Returning `true` from the process function is equal to saying 'work has completed' and will stop propogation to the route's children.
     * @param {number} [levels=-1] (Optional) The number of levels (excluding the parent) to dive deeper into the route tree.
     * A value of 1 for example, will process the route and its first-level children only. By default, scans all levels of the route tree.
     */
    protected deepScanRoute(route: ActivatedRouteSnapshot, process: (route: ActivatedRouteSnapshot, component: any) => void, levels?: number): void;
    /**
     * Recoursively runs a processing function on the route and its children.
     * Scan is done from parent to child, meaning the parent is the first to process.
     * 
     * @protected
     * @param {ActivatedRouteSnapshot} route The top route on which to apply the processing function.
     * @param {(route: ActivatedRouteSnapshot, component: any) => boolean | void} process The function to run on the route and its children. The function receives a `route` argument which reflects the route being processed,
     * and a `component` argument which reflects the component that was loaded for the route's outlet.
     * If the corresponding outlet wasn't marked with the `publishComponent` directive, the `component` argument will be null.
     * 
     * Returning `true` from the process function is equal to saying 'work has completed' and will stop propogation to the route's children.
     * @param {number} [levels=-1] (Optional) The number of levels (excluding the parent) to dive deeper into the route tree.
     * A value of 1 for example, will process the route and its first-level children only. By default, scans all levels of the route tree.
     */
    protected deepScanRoute(route: ActivatedRouteSnapshot, process: (route: ActivatedRouteSnapshot, component: any) => boolean | void, levels: number = -1): void
    {
        // Make sure the caller wants scan to proceed, then make sure level limit wasn't reached.
        const processingConcluded = process(route, this.componentBus?.instance(route.outlet));
        // Negative values will scan all, positives will scan until reaching zero.
        const shouldScanChildren  = !processingConcluded && levels !== 0;

        if (shouldScanChildren && route.children) route.children.forEach(childRoute => this.deepScanRoute(childRoute, process, levels - 1));
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
     * @protected
     * @param {(Resolver | Resolver[])} resolvers The resolver(s) to concat.
     * @param {...any[]} resolverArgs (Optional) Any arguments to pass into the resolvers in addition to the component.
     */
    protected resolveInMacroTask(resolvers: Resolver | Resolver[], ...resolverArgs: any[]): Observable<any[]>
    {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const macroTask = Zone.current.scheduleMacroTask(`${ResolverMacroTaskIdPrefix}-${Math.random()}`, () => { }, {}, () => { }, () => { });

        return this.resolve(resolvers, ...resolverArgs)
            // Signal end of macro task on completion or error and allow server to return
            .pipe(finalize(() => macroTask.invoke())
        );
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

import { from, InteropObservable, Observable, of                                        } from 'rxjs';
import { filter, concatAll, toArray                                                     } from 'rxjs/operators';
import { Injectable                                                                     } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ActivatedRouteSnapshot } from '@angular/router';
import { Destroyable                                                                    } from '@bespunky/angular-zen/core';

import { RouterOutletComponentBus } from '../outlet/router-outlet-component-bus.service';

declare const Zone: any;

export type Resolver = (component: any, ...resolverArgs: any[]) => Observable<any> | InteropObservable<any> | Promise<any>;

@Injectable()
export abstract class RouteAwareService extends Destroyable
{
    constructor(
        protected router       : Router,
        protected route        : ActivatedRoute,
        protected componentBus?: RouterOutletComponentBus
    )
    {
        super();

        this.subscribe(this.router.events.pipe(filter(event => event instanceof NavigationStart)), this.onNavigationStart.bind(this));
        this.subscribe(this.router.events.pipe(filter(event => event instanceof NavigationEnd  )), this.onNavigationEnd.bind(this));
    }
    
    /**
     * Runs on route change, before navigating to it. Override to implement.
     * 
     * @virtual
     * @protected
     * @param {NavigationStart} event The router's event data.
     */
    protected onNavigationStart(event: NavigationStart): void { }

    /**
     * Runs after the route was changed. Override to implement.
     * 
     * @virtual
     * @protected
     * @param {NavigationEnd} event The router's event data.
     */
    protected onNavigationEnd(event: NavigationEnd): void { }

    protected deepScanRoute(route: ActivatedRouteSnapshot, process: (route: ActivatedRouteSnapshot, component: any) => void): void
    {
        process(route, this.componentBus?.instance(route.outlet));

        if (route.children) route.children.forEach(childRoute => this.deepScanRoute(childRoute, process));
    }
    
    protected resolveAndProcess(resolvers: Resolver | Resolver[], process: (resolved: any) => void, ...resolverArgs: any[]): void
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

    protected resolve(resolvers: Resolver | Resolver[], ...resolverArgs: any[]): Observable<any>
    {
        if (!resolvers) return of([]);

        // Cast array
        if (!Array.isArray(resolvers)) resolvers = [resolvers];

        // Run resolvers to create observable tasks
        const observables = resolvers.map(resolve => resolve(this.activatedRouteComponent, ...resolverArgs));
        
        // Run tasks and output their returned data as an array
        return from(observables).pipe(concatAll(), toArray());
    }

    protected get activatedRouteComponent(): any | null
    {
        return this.componentBus?.instance(this.route.outlet);
    }
}

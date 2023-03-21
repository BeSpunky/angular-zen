import { Observable, of, PartialObserver                                                } from 'rxjs';
import { TestBed                                                                        } from '@angular/core/testing';
import { RouterTestingModule                                                            } from '@angular/router/testing';
import { Injectable, Type                                                               } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ActivatedRouteSnapshot } from '@angular/router';
import { subscribeSpyTo                                                                 } from '@hirez_io/observer-spy';

import { forceRoutingInsideAngularZone                                        } from '@bespunky/angular-zen/core/testing';
import { createDeeplyNestedRoutes, DeepRouteSegments, DeepRouteSegmentsNoRoot } from '@bespunky/angular-zen/router-x/testing';
import { RouterOutletComponentBus                                             } from '../outlet/router-outlet-component-bus.service';
import { Resolver, ResolverMacroTaskIdPrefix, RouteAware                      } from './route-aware.service';

declare const Zone: any;

describe('RouteAware (abstract)', () =>
{
    let service: RouteAwareMock;
    let router : Router;
    let bus    : RouterOutletComponentBus;
    let process: jest.SpyInstance<boolean, [ActivatedRouteSnapshot, any]>;

    function setup(config?: { withBus: boolean })
    {
        config = config || { withBus: true };

        const routes = [createDeeplyNestedRoutes(DeepRouteSegmentsNoRoot)];

        TestBed.configureTestingModule({
            imports: [RouterTestingModule.withRoutes(routes)]
        });

        service = TestBed.inject(config.withBus ? RouteAwareMock : RouteAwareMockNoBus);
        router  = TestBed.inject(Router);
        bus     = TestBed.inject(RouterOutletComponentBus);
        process = jest.fn<boolean, [ActivatedRouteSnapshot, any]>();

        forceRoutingInsideAngularZone(router);
    }

    describe('on router events', () =>
    {
        beforeEach(() => setup());
        
        // As the router triggers multiple events for a single navigation, this also tests that
        // events with no handlers don't fail.
        it('should dispatch events to their correct handler method', async () =>
        {
            jest.spyOn(service, 'onNavigationStart').mockImplementation();
            jest.spyOn(service, 'onNavigationEnd'  ).mockImplementation();

            await router.navigate(DeepRouteSegments);

            expect(service.onNavigationStart).toHaveBeenCalledTimes(1);
            expect(service.onNavigationEnd  ).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('calling `observeRouterEvent`', () =>
    {
        beforeEach(() => setup());

        it('should return an observable for router events of the specified type only', async () =>
        {
            // Using NavigationEnd as it is the last fired event for a navigation. If only NavigationEnd fires, this proves
            // the observable filtered correctly.
            const navigationEnd    = service.observeRouterEvent(NavigationEnd);
            const navigationEndSpy = subscribeSpyTo(navigationEnd);

            await router.navigate(DeepRouteSegments);
            
            expect(navigationEndSpy.getFirstValue()).toBeInstanceOf(NavigationEnd);

            navigationEndSpy.unsubscribe();
        });

        function testAutoUnsubscribe(auto: boolean, done: jest.DoneCallback)
        {
            const navigationEnd = service.observeRouterEvent(NavigationEnd, auto);
            const complete      = jest.fn().mockImplementation();

            navigationEnd.subscribe({ complete });

            service.ngOnDestroy();

            // Let event-loop finish its work so the observable gets a chance to complete, then run expectation.
            setTimeout(() =>
            {
                auto ? expect(complete).toHaveBeenCalledTimes(1) : expect(complete).not.toHaveBeenCalled();

                done();
            }, 0);
        }

        it('should self unsubscribe on destroy when `autoUnsubscribe` is `true`', done =>
        {
            testAutoUnsubscribe(true, done);
        });

        it('should stay subscribed on destroy when `autoUnsubscribe` is `false`', done =>
        {
            testAutoUnsubscribe(false, done);
        });
    });

    describe('calling `deepScanRoute`', () =>
    {
        function scannedRoutesInSpy(): string[]
        {
            return process.mock.calls.map(callArgs => callArgs[0] as ActivatedRouteSnapshot)
                                     .map(route    => route.url.toString());
        }

        function scannedComponentsInSpy(): any[]
        {
            return process.mock.calls.map(callArgs => callArgs[1]);
        }

        describe('basically', () =>
        {
            beforeEach(() => setup());
            
            it('should perform a recoursive scan of a route and its children', async () =>
            {
                await router.navigate(DeepRouteSegments);
                
                service.scanRouteSegments(process as jest.Mock);
                
                expect(scannedRoutesInSpy()).toEqual(DeepRouteSegments);
            });
            
            it('should stop at the specified level', async () =>
            {
                await router.navigate(DeepRouteSegments);
                
                service.scanRouteSegments(process as jest.Mock, 3);
                
                expect(scannedRoutesInSpy()).toEqual(DeepRouteSegments.slice(0, 4)); // Root + 3 child levels
            });

            it('should stop propagation when the process function returns `true`', async () =>
            {
                process.mockReturnValue(true);

                await router.navigate(DeepRouteSegments);
                
                service.scanRouteSegments(process as jest.Mock);
                
                expect(scannedRoutesInSpy()).toEqual(DeepRouteSegments.slice(0, 1)); // Root route only
            });
        });

        /**
         * The scan method fetches the appropriate component for the outlet associated with the current route
         * it is placed on at the moment. For the method to fetch a component, 2 things should occur:
         * 1. A route with a secondary outlet should exist.
         * 2. A component should be published for the secondary outlet.
         * 
         * The test will be performed on the first two segments of `DeepRouteSegments`.
         * The first segment (root segment) should be associated with the component for the primary outlet.
         * The second segment should be associated with the component for the secondary outlet.
         */
        async function prepareOutletComponentTest()
        {
            // Create dummy components to publish for the primary and secondary outlets
            const component1 = { name: 'component1' };
            const component2 = { name: 'component2' };

            const SECONDARY_OUTLET = 'secondary';

            // Manipulate router configuration to define the secondary outlet for the second segment (root segment is not defined in config, so index 0 is the second segment)
            router.config[0].outlet = SECONDARY_OUTLET;

            // Publish the first component for the primary outlet
            bus.publishComponent(component1);
            // Publish the first component for the secondary outlet
            bus.publishComponent(component2, SECONDARY_OUTLET);

            const primarySegment   = DeepRouteSegments[0];
            const secondarySegment = DeepRouteSegments[1];

            // Load the route and the outlets
            await router.navigate([primarySegment]);
            await router.navigate([{ outlets: { [SECONDARY_OUTLET]: [secondarySegment] } }]);

            // Launch the scan and have the spy collect the arguments
            service.scanRouteSegments(process as jest.Mock, 1);

            return { component1, component2 };
        }

        it('should pass the relevant component instance of each route to the process function when a bus exists', async () =>
        {
            setup();
        
            const { component1, component2 } = await prepareOutletComponentTest();
            
            const components = scannedComponentsInSpy();

            expect(components[0]).toBe(component1);
            expect(components[1]).toBe(component2);
        });

        it('should `undefined` as the component instance of each route to the process function when a bus doesn\'t exists', async () =>
        {
            setup({ withBus: false });

            await prepareOutletComponentTest();
            
            const components = scannedComponentsInSpy();

            expect(components[0]).toBeUndefined();
            expect(components[1]).toBeUndefined();
        });
    });

    function produceResolveSpecs(delegateResolve: () => (resolvers: Resolver | Resolver[], ...args: any[]) => Observable<any[]>)
    {
        let resolve: (resolvers: Resolver | Resolver[], ...args: any[]) => Observable<any[]>;

        beforeEach(() =>
        {
            setup();

            resolve = delegateResolve();
        });

        const observableValue = 'resolved observable';
        const promiseValue    = 'resolved promise';
        const resolvedValues  = [observableValue, promiseValue];
        const resolvers       = [
            jest.fn().mockReturnValue(of(observableValue)),
            jest.fn().mockReturnValue(Promise.resolve(promiseValue))
        ];

        it('should still return an observable when no resolvers were supplied', () =>
        {
            expect(resolve([])).toBeInstanceOf(Observable);
        });

        it('should pass the activated component then resolverArgs to the resolvers', () =>
        {
            const resolverArgs       = ['dummyArg1', 2];
            const activatedComponent = { name: 'activatedComponent' };
            const expectedArgs       = [activatedComponent, ...resolverArgs];

            bus.publishComponent(activatedComponent);

            resolve(resolvers, ...resolverArgs).subscribe();

            // First arg is always the component, so cut it out
            expect(resolvers[0].mock.calls[0]).toEqual(expectedArgs);
            expect(resolvers[1].mock.calls[0]).toEqual(expectedArgs);
        });

        it('should pass an array of resolved values to subscribers', done =>
        {
            resolve(resolvers).subscribe(resolved =>
            {
                expect(resolved).toEqual(resolvedValues);

                done();
            });
        });
    }

    describe('calling `resolve()`', () => produceResolveSpecs(() => service.resolveInMacroTask.bind(service)));

    describe('calling `resolveInMacroTask()`', () =>
    {
        produceResolveSpecs(() => service.resolveInMacroTask.bind(service));

        //#region Macro Task Testing Functions

        // Checks whether the task id was created by the `resolveInMacroTask` method
        function macroTaskCallMadeByLibrary(taskId: string): boolean
        {
            return taskId.startsWith(ResolverMacroTaskIdPrefix);
        }

        // Spys on the current zone's `scheduleMacroTask` and, when called by the library, spies on the `invoke` method of the
        // created task as well. As the spy for `invoke` is only created when `scheduleMacroTask` is called, this function
        // cannot return a spy object for it.
        // The `spies` parameter is there to allow the `jest.spyOnMacroTaskCreation` function to fill-in the `invoke` spy even after it returned.
        function spyOnMacroTaskCreation(spies: { scheduleMacroTask?: jest.SpyInstance, macroTaskInvoke?: jest.SpyInstance })
        {
            const originalScheduleMacroTask = Zone.current.scheduleMacroTask.bind(Zone.current);
            
            // Spy on the schedule function and when it is called, spy on the invoke function of the scheduled task
            spies.scheduleMacroTask = jest.spyOn(Zone.current, 'scheduleMacroTask').mockImplementation((...args: any[]) =>
            {
                const macroTask = originalScheduleMacroTask(...args);
                
                // jest, setTimeout, and others might also create macro tasks, so only replace the `invoke` method if
                // the task was created by the library. This ensures that the `spies.macroTaskInvoke` is only set for
                // the appropriate call.
                if (macroTaskCallMadeByLibrary(args[0]))
                    spies.macroTaskInvoke = jest.spyOn(macroTask, 'invoke');

                return macroTask;
            });
        }

        function callsToMacroTaskMadeByLibrary(spy: jest.SpyInstance)
        {
            return spy.mock.calls.filter(callArgs => macroTaskCallMadeByLibrary(callArgs[0] || ''));
        }

        function testMacroTaskResolve(resolver: Resolver, expectOn: 'complete' | 'error', done: jest.DoneCallback)
        {
            const spies: { scheduleMacroTask: jest.SpyInstance, macroTaskInvoke: jest.SpyInstance } = {} as any;

            // Spy on `scheduleMacroTask` and fill-in the spies object when spies are created.
            // `spies.macroTaskInvoke` will be undefined until the task is created. By the time calles to `invoke` should
            // be tested, the service would have already called `scheduleMacroTask` and `spies.macroTaskInvoke` will hold the new spy.
            spyOnMacroTaskCreation(spies);

            const expectMacroTaskDone = () =>
            {
                setTimeout(() =>
                {
                    // jest, setTimeout, and others might also create macro tasks, so only count tasks created by the library
                    const relevantCallsToScheduler = callsToMacroTaskMadeByLibrary(spies.scheduleMacroTask);

                    expect(relevantCallsToScheduler.length).toBe(1);
                    expect(spies.macroTaskInvoke).toHaveBeenCalledTimes(1);
                
                    // As `Zone` is global, restore its original scheduling implementation to avoid affecting other tests.
                    spies.scheduleMacroTask.mockRestore();

                    done();
                }, 0);
            }

            const observer = { [expectOn]: expectMacroTaskDone } as unknown as PartialObserver<any[]>;

            service.resolveInMacroTask(resolver).subscribe(observer);
        }

        //#endregion

        it('should create a zone macro task and complete it when the observable completes', (done) => testMacroTaskResolve(() => Promise.resolve('resolved value'), 'complete', done));
        it('should create a zone macro task and complete it when the observable errors'   , (done) => testMacroTaskResolve(() => Promise.reject ('resolver error'), 'error'   , done));
    });

    describe('`activatedRouteComponent', () =>
    {
        describe('with component bus', () =>
        {
            beforeEach(() => setup());
            
            it('should retrieve the instance of the component activated by the outlet of the current route', () =>
            {
                const component = { name: 'component' };
                
                bus.publishComponent(component);
                
                expect(service.activatedRouteComponent).toBe(component);
            });
        
            it('should return `null` if the outlet of the current route didn\'t activate a component', () => expect(service.activatedRouteComponent).toBeNull());
        });
        
        describe('without a component bus', () =>
        {
            beforeEach(() => setup({ withBus: false }));

            it('should return `undefined`', () => expect(service.activatedRouteComponent).toBeUndefined());
        });
    });
});

@Injectable({ providedIn: 'root' })
class RouteAwareMock extends RouteAware
{
    onNavigationStart(event: NavigationStart): void { void 0; }
    
    onNavigationEnd(event: NavigationEnd): void { void 0; }

    scanRouteSegments(process: (route: ActivatedRouteSnapshot, component: any) => boolean, levels?: number): void
    {
        this.deepScanRoute(this.route.snapshot, process, levels);
    }

    override resolveInMacroTask(resolvers: Resolver | Resolver[], ...resolverArgs: any[]): Observable<any[]>
    {
        return super.resolveInMacroTask(resolvers, ...resolverArgs);
    }

    override resolve(resolvers: Resolver | Resolver[], ...resolverArgs: any[]): Observable<any[]>
    {
        return super.resolve(resolvers, ...resolverArgs);
    }

    // Using any to simplify testing. For some reason typescript is not happy with the same signature as the one from the base class
    override observeRouterEvent(eventType: Type<any>, autoUnsubscribe: boolean = true): Observable<any>
    {
        return super.observeRouterEvent(eventType, autoUnsubscribe);
    }

    override get activatedRouteComponent() { return super.activatedRouteComponent; }
}

@Injectable({ providedIn: 'root' })
class RouteAwareMockNoBus extends RouteAwareMock
{
    constructor(router: Router, route: ActivatedRoute) { super(router, route); }
}
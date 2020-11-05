import { Observable, of, PartialObserver                                                } from 'rxjs';
import { TestBed                                                                        } from '@angular/core/testing';
import { RouterTestingModule                                                            } from '@angular/router/testing';
import { Injectable                                                                     } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart, ActivatedRouteSnapshot } from '@angular/router';

import { forceRoutingInsideAngularZone                                        } from '@bespunky/angular-zen/core/testing';
import { createDeeplyNestedRoutes, DeepRouteSegments, DeepRouteSegmentsNoRoot } from '@bespunky/angular-zen/router-x/testing';
import { RouterOutletComponentBus                                             } from '../outlet/router-outlet-component-bus.service';
import { Resolver, ResolverMacroTaskIdPrefix, RouteAwareService               } from './route-aware.service';

declare const Zone: any;

describe('RouteAwareService (abstract)', () =>
{
    let service: RouteAwareMock;
    let router : Router;
    let bus    : RouterOutletComponentBus;
    let process: jasmine.Spy;

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
        process = jasmine.createSpy('processRoute');

        forceRoutingInsideAngularZone(router);
    }

    describe('on router events', () =>
    {
        beforeEach(() => setup());
        
        // As the router triggers multiple events for a single navigation, this also tests that
        // events with no handlers don't fail.
        it('should dispatch events to their correct handler method', async () =>
        {
            spyOn(service, 'onNavigationStart').and.stub();
            spyOn(service, 'onNavigationEnd'  ).and.stub();

            await router.navigate(DeepRouteSegments);

            expect(service.onNavigationStart).toHaveBeenCalledTimes(1);
            expect(service.onNavigationEnd  ).toHaveBeenCalledTimes(1);
        });
    });
    
    describe('calling `deepScanRoute`', () =>
    {
        function scannedRoutesInSpy(): string[]
        {
            return process.calls.allArgs()
                                .map(callArgs => callArgs[0] as ActivatedRouteSnapshot)
                                .map(route    => route.url.toString());
        }

        function scannedComponentsInSpy(): any[]
        {
            return process.calls.allArgs()
                                .map(callArgs => callArgs[1]);
        }

        describe('basically', () =>
        {
            beforeEach(() => setup());
            
            it('should perform a recoursive scan of a route and its children', async () =>
            {
                await router.navigate(DeepRouteSegments);
                
                service.scanRouteSegments(process);
                
                expect(scannedRoutesInSpy()).toEqual(DeepRouteSegments);
            });
            
            it('should stop at the specified level', async () =>
            {
                await router.navigate(DeepRouteSegments);
                
                service.scanRouteSegments(process, 3);
                
                expect(scannedRoutesInSpy()).toEqual(DeepRouteSegments.slice(0, 4)); // Root + 3 child levels
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
            service.scanRouteSegments(process, 1);

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
            jasmine.createSpy('promise resolver'   ).and.returnValue(of(observableValue)),
            jasmine.createSpy('observable resolver').and.returnValue(Promise.resolve(promiseValue)),
        ];

        it('should still return an observable when no resolvers were supplied', () =>
        {
            expect(resolve([])).toBeInstanceOf(Observable);
        });

        it('should still return an observable when supplied with `undefined` for resolvers', () =>
        {
            expect(resolve(undefined)).toBeInstanceOf(Observable);
        });

        it('should still return an observable when supplied with `null` for resolvers', () =>
        {
            expect(resolve(null)).toBeInstanceOf(Observable);
        });

        it('should pass the activated component then resolverArgs to the resolvers', () =>
        {
            const resolverArgs       = ['dummyArg1', 2];
            const activatedComponent = { name: 'activatedComponent' };
            const expectedArgs       = [activatedComponent, ...resolverArgs];

            bus.publishComponent(activatedComponent);

            resolve(resolvers, ...resolverArgs).subscribe();

            // First arg is always the component, so cut it out
            expect(resolvers[0].calls.mostRecent().args).toEqual(expectedArgs);
            expect(resolvers[1].calls.mostRecent().args).toEqual(expectedArgs);
        });

        it('should pass an array of resolved values to subscribers', (done: DoneFn) =>
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
        // The `spies` parameter is there to allow the `spyOnMacroTaskCreation` function to fill-in the `invoke` spy even after it returned.
        function spyOnMacroTaskCreation(spies: { scheduleMacroTask?: jasmine.Spy, macroTaskInvoke?: jasmine.Spy })
        {
            const originalScheduleMacroTask = Zone.current.scheduleMacroTask.bind(Zone.current);
            
            // Spy on the schedule function and when it is called, spy on the invoke function of the scheduled task
            spies.scheduleMacroTask = spyOn(Zone.current, 'scheduleMacroTask').and.callFake((...args: any[]) =>
            {
                const macroTask = originalScheduleMacroTask(...args);
                
                // jasmine, setTimeout, and others might also create macro tasks, so only replace the `invoke` method if
                // the task was created by the library. This ensures that the `spies.macroTaskInvoke` is only set for
                // the appropriate call.
                if (macroTaskCallMadeByLibrary(args[0]))
                    spies.macroTaskInvoke = spyOn(macroTask, 'invoke').and.callThrough();

                return macroTask;
            });
        }

        function callsToMacroTaskMadeByLibrary(spy: jasmine.Spy)
        {
            return spy.calls.all().filter(call => macroTaskCallMadeByLibrary(call.args[0] || ''));
        }

        function testMacroTaskResolve(resolver: Resolver, expectOn: 'complete' | 'error', done: DoneFn)
        {
            const spies: { scheduleMacroTask: jasmine.Spy, macroTaskInvoke: jasmine.Spy } = {} as any;

            // Spy on `scheduleMacroTask` and fill-in the spies object when spies are created.
            // `spies.macroTaskInvoke` will be undefined until the task is created. By the time calles to `invoke` should
            // be tested, the service would have already called `scheduleMacroTask` and `spies.macroTaskInvoke` will hold the new spy.
            spyOnMacroTaskCreation(spies);

            const expectMacroTaskDone = () =>
            {
                setTimeout(() =>
                {
                    // jasmine, setTimeout, and others might also create macro tasks, so only count tasks created by the library
                    const relevantCallsToScheduler = callsToMacroTaskMadeByLibrary(spies.scheduleMacroTask);

                    expect(relevantCallsToScheduler.length).toBe(1);
                    expect(spies.macroTaskInvoke).toHaveBeenCalledTimes(1);
                
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
class RouteAwareMock extends RouteAwareService
{
    onNavigationStart(event: NavigationStart): void { }
    
    onNavigationEnd(event: NavigationEnd): void { }

    scanRouteSegments(process: (route: ActivatedRouteSnapshot, component: any) => void, levels?: number): void
    {
        this.deepScanRoute(this.route.snapshot, process, levels);
    }

    resolveInMacroTask(resolvers: Resolver | Resolver[], ...resolverArgs: any[]): Observable<any[]>
    {
        return super.resolveInMacroTask(resolvers, ...resolverArgs);
    }

    resolve(resolvers: Resolver | Resolver[], ...resolverArgs: any[]): Observable<any[]>
    {
        return super.resolve(resolvers, ...resolverArgs);
    }

    get activatedRouteComponent() { return super.activatedRouteComponent; }
}

@Injectable({ providedIn: 'root' })
class RouteAwareMockNoBus extends RouteAwareMock
{
    constructor(router: Router, route: ActivatedRoute) { super(router, route); }
}
import { TestBed } from '@angular/core/testing';

import { ComponentPublishEventData, RouterOutletComponentBus, RouterOutletEventData } from './router-outlet-component-bus.service';

const SecondaryOutletName = 'header';
const DummyComponent      = { name: 'component' };

describe('RouterOutletComponentBus', () =>
{
    let bus: RouterOutletComponentBus;

    function setup()
    {
        TestBed.configureTestingModule({})

        bus = TestBed.inject(RouterOutletComponentBus);
    }

    beforeEach(setup);

    describe('basically', () =>
    {
        it('should be created', () => expect(bus).toBeDefined());

        function testIsComponentPublished(outletName?: string)
        {
            expect(bus.isComponentPublished(outletName)).toBeFalse();
            
            bus.publishComponent(DummyComponent, outletName);
            
            expect(bus.isComponentPublished(outletName)).toBeTrue();    
        }

        it('should detect if a named outlet has published', () => testIsComponentPublished(SecondaryOutletName));

        it('should detect if the primary unnamed outlet has published', () => testIsComponentPublished());

        it('should return `null` when calling `changes()` with a non-published outlet name', () => expect(bus.changes('never-published-outlet')).toBeNull());
        it('should return `null` when calling `instance()` with a non-published outlet name', () => expect(bus.instance('never-published-outlet')).toBeNull());
    });

    describe('when publishing a component', () =>
    {
        function producePublishTestSpecs(outletName?: string)
        {
            let nextChange    : jasmine.Spy;
            let publishedEvent: jasmine.Spy;

            beforeEach(() =>
            {
                // Do the first publish to create the observable
                bus.publishComponent(DummyComponent, outletName);

                nextChange     = spyOn(bus.changes(outletName), 'next').and.callThrough();
                publishedEvent = spyOn(bus.componentPublished, 'emit').and.callThrough();

                // Do another publish to trigger spies
                bus.publishComponent(DummyComponent, outletName);
            });

            it('should expose the published component through the `instance()` method', () =>
            {
                expect(bus.instance(outletName)).toBe(DummyComponent);
            });

            it('should allow tracking changes to the published component through the `changes()` method', () =>
            {
                expect(nextChange).toHaveBeenCalledTimes(1);

                const component = nextChange.calls.mostRecent().args[0];

                expect(component).toBe(DummyComponent);
            });

            it('should notify subscribers of the `componentPublished` event', () =>
            {
                const event = publishedEvent.calls.mostRecent().args[0] as ComponentPublishEventData;

                expect(event.outletName       ).toBe(outletName);
                expect(event.changes          ).toBe(bus.changes (outletName));
                expect(event.componentInstance).toBe(bus.instance(outletName));
            });
        }

        describe('by named outlet', () => producePublishTestSpecs(SecondaryOutletName));

        describe('by unnamed outlet', () => producePublishTestSpecs());
    });

    describe('when unpublishing a component', () =>
    {
        function produceUnpublishTestSpecs(outletName?: string)
        {
            let completeChanges : jasmine.Spy;
            let unpublishedEvent: jasmine.Spy;

            beforeEach(() =>
            {
                bus.publishComponent(DummyComponent, outletName);

                completeChanges  = spyOn(bus.changes(outletName), 'complete').and.callThrough();
                unpublishedEvent = spyOn(bus.componentUnpublished, 'emit').and.callThrough();

                bus.unpublishComponent(outletName);
            });

            it('should notify subscribers of outlet changes of completion', () =>
            {
                expect(completeChanges).toHaveBeenCalledTimes(1);
            });

            it('should remove the outlet completely from the service', () =>
            {
                expect(bus.changes(outletName)).toBeNull();
                expect(bus.isComponentPublished(outletName)).toBeFalse();
            });

            it('should notify subscribers of the `componentUnpublished` event', () =>
            {
                expect(unpublishedEvent).toHaveBeenCalledTimes(1);

                const event = unpublishedEvent.calls.mostRecent().args[0] as RouterOutletEventData;

                expect(event.outletName).toBe(outletName);
            });

            it('should not throw if the requested outlet was never published', () =>
            {
                expect(() => bus.unpublishComponent('never-published-outlet')).not.toThrow();
            });
        }
        
        describe('by named outlet', () => produceUnpublishTestSpecs(SecondaryOutletName));

        describe('by unnamed outlet', () => produceUnpublishTestSpecs());
    });
});

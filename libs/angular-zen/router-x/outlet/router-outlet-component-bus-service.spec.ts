import { TestBed        } from '@angular/core/testing';
import { PRIMARY_OUTLET } from '@angular/router';

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
            expect(bus.isComponentPublished(outletName)).toBe(false);
            
            bus.publishComponent(DummyComponent, outletName);
            
            expect(bus.isComponentPublished(outletName)).toBe(true);    
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
            let nextChange    : jest.SpyInstance;
            let publishedEvent: jest.SpyInstance;

            beforeEach(() =>
            {
                // Do the first publish to create the observable
                bus.publishComponent(DummyComponent, outletName);

                const changes = bus.changes(outletName);

                if (!changes) throw new Error(`bus.changes('${outletName}') should've returned an observable. Received ${changes}.`);

                nextChange     = jest.spyOn(changes, 'next');
                publishedEvent = jest.spyOn(bus.componentPublished, 'emit');

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

                const component = nextChange.mock.calls[0][0];

                expect(component).toBe(DummyComponent);
            });

            it('should notify subscribers of the `componentPublished` event', () =>
            {
                const event = publishedEvent.mock.calls[0][0] as ComponentPublishEventData;

                expect(event.outletName       ).toBe(outletName || PRIMARY_OUTLET);
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
            let completeChanges : jest.SpyInstance;
            let unpublishedEvent: jest.SpyInstance;

            beforeEach(() =>
            {
                bus.publishComponent(DummyComponent, outletName);

                const changes = bus.changes(outletName);

                if (!changes) throw new Error(`bus.changes('${outletName}') should've returned an observable. Received ${changes}.`);

                completeChanges  = jest.spyOn(changes, 'complete');
                unpublishedEvent = jest.spyOn(bus.componentUnpublished, 'emit');

                bus.unpublishComponent(outletName);
            });

            it('should notify subscribers of outlet changes of completion', () =>
            {
                expect(completeChanges).toHaveBeenCalledTimes(1);
            });

            it('should remove the outlet completely from the service', () =>
            {
                expect(bus.changes(outletName)).toBeNull();
                expect(bus.isComponentPublished(outletName)).toBe(false);
            });

            it('should notify subscribers of the `componentUnpublished` event', () =>
            {
                expect(unpublishedEvent).toHaveBeenCalledTimes(1);

                const event = unpublishedEvent.mock.calls[0][0] as RouterOutletEventData;

                expect(event.outletName).toBe(outletName || PRIMARY_OUTLET);
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

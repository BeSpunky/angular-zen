import { interval, PartialObserver, Subscription    } from 'rxjs';
import { takeUntil                                  } from 'rxjs/operators';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { Component                                  } from '@angular/core';

import { Destroyable } from './destroyable';

describe('Destroyable (abstract)', () =>
{
    let fixture  : ComponentFixture<TestComponent>;
    let component: TestComponent;

    beforeEach(async () =>
    {
        TestBed.configureTestingModule({
            declarations: [TestComponent]
        }).compileComponents();
        
        fixture   = TestBed.createComponent(TestComponent);
        component = fixture.componentInstance;
    });

    it('should be created', () => expect(component).toBeTruthy());

    function testSubscriptionOnDestroy(subscribeFn: () => (observer: PartialObserver<any>) => Subscription)
    {
        return fakeAsync(() =>
        {
            const subscribe = subscribeFn();

            let ticks = 0;
        
            // Count emitted values
            subscribe({ next: value => ticks = value });
        
            // Allow the observable to emit 4 times before destruction
            tick(5000);
        
            fixture.destroy();

            // Proof that the observable hasn't been completed before ngOnDestroy was called.
            expect(ticks).toBeGreaterThanOrEqual(4);
        });
    }

    it('should emit and complete the `destroyed` subject when on `ngOnDestroy()`', testSubscriptionOnDestroy(() => component.subscribeToSelfDestroyingInterval.bind(component)));

    it('should unsubscribe all subscriptions created using the `subscribe` method on `ngOnDestroy()`', testSubscriptionOnDestroy(() => component.subscribeToSubscribedInterval.bind(component)));
});

@Component({
    selector: 'bs-zen-destroyable-test',
    template: ''
})
class TestComponent extends Destroyable
{
    public subscribeToSelfDestroyingInterval(observer: PartialObserver<any>): Subscription
    {
        return interval(1000).pipe(takeUntil(this.destroyed)).subscribe(observer);
    }

    public subscribeToSubscribedInterval(observer: PartialObserver<any>): Subscription
    {
        return this.subscribe(interval(1000), observer);
    }
}
import { Observable, PartialObserver, Subject, Subscription   } from 'rxjs';
import { Directive, OnDestroy } from '@angular/core';

/**
 * Facilitates working with components, directives and services which manually subscribe to observables.
 * Extend this class to easily hook into ngOnDestroy and avoid memory leaks.
 *
 * @see [Wiki](https://bs-angular-zen.web.app/docs/zen/additional-documentation/coremodule/destroyable-(abstract).html) for full guide.
 * 
 * @export
 * @abstract
 * @class Destroyable
 * @implements {OnDestroy}
 */
@Directive()
export abstract class Destroyable implements OnDestroy
{
    /**
     * Emits a value when `ngOnDestroy()` is called.
     * Pipe together with `takeUntil()` to auto unsubscribe from your observables.
     *
     * @example
     * observable.pipe(takeUntil(this.destroyed)).subscribe(...);
     * 
     * @protected
     * @type {Subject<void>}
     */
    protected readonly destroyed    : Subject<void> = new Subject();
    /**
     * A list of all subscriptions manually added using the `subscribe()` method.
     * These are automatically unsubscribed when `ngOnDestroy()` is called.
     *
     * @protected
     * @type {Subscription}
     */
    protected readonly subscriptions: Subscription  = new Subscription();

    ngOnDestroy()
    {
        this.destroyed.next();
        this.destroyed.complete();
        
        this.subscriptions.unsubscribe();
    }
    
    /**
     * Subscribes to an observable and stores the subscription for automatic disposal.
     * When `ngOnDestroy()` is called, all subscriptions created with this method will unsubscribe.
     *
     * @protected
     * @template T The type of data the observable will emit.
     * @param {Observable<T>} observable The observable to subscribe to.
     * @param {(value: T) => void} [next] (Optional) A callback function to execute on each emission of the observable.
     * @param {(error: any) => void} [error] (Optional) A callback function to execute when the observable errors.
     * @param {() => void} [complete] (Optional) A callback function to execute when the observable completes.
     * @returns {Subscription} The subscription created for the observable.
     */
    protected subscribe<T>(observable: Observable<T>, next?: (value: T) => void, error?: (error: unknown) => void, complete?: () => void): Subscription;
    /**
     * Subscribes to an observable and stores the subscription for automatic disposal.
     * When `ngOnDestroy()` is called, all subscriptions created with this method will unsubscribe.
     *
     * @protected
     * @template T The type of data the observable will emit.
     * @param {Observable<T>} observable The observable to subscribe to.
     * @param {PartialObserver<T>} [observer] The observer that will handle observable events.
     * @returns {Subscription} The subscription created for the observable.
     */
    protected subscribe<T>(observable: Observable<T>, observer?: PartialObserver<T>): Subscription;
    protected subscribe<T>(observable: Observable<T>, observerOrNext?: PartialObserver<T> | ((value: T) => void), error?: (error: unknown) => void, complete?: () => void): Subscription
    {
        // Cast partial observer object
        const observer = observerOrNext instanceof Function ? {
            next: observerOrNext,
            error,
            complete
        } : observerOrNext;

        this.subscriptions.add(observable.subscribe(observer));

        return this.subscriptions;
    }
}
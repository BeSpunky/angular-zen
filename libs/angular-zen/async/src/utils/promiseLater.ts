type LatePromise<T> = {
    promise: Promise<T>;
    resolve: (value: T | PromiseLike<T>) => void;
    reject : (reason?: any) => void;
};

/**
 * Creates a promise without which doesn't have the actual async code to resolve, and extracts its `resolve()` and `reject()` methods for later use.
 * Use this when you have to create a promise for an async code that runs in a place different to the one where you create the promise, and it will
 * allow you full control of the promise from other parts of your code.
 *
 * @example
 * import { promiseLater } from '@bespunky/angular-zen/core';
 * // Other imports...
 *
 * export class SomeDirective implements OnInit, OnChanges
 * {
 *     private const waitForInit: Promise<SomeType>;
 *
 *     constructor()
 *     {
 *         this.waitForInit = promiseLater();
 *     }
 *
 *     ngOnInit()
 *     {
 *         this.waitForInit.resolve();
 *     }
 *
 *     ngOnChanges(changes: SimpleChanges)
 *     {
 *         this.waitForInit.promise.then(() => {
 *             // ... Some code
 *         });
 *     }
 * }
 *
 * @export
 * @template T The type of the value promised after resolving the async operation.
 * @returns An object containing the promise, anlong with its `resolve()` and `reject()` methods.
 */
export function promiseLater<T>(): LatePromise<T>
{
    const latePromise: Partial<LatePromise<T>> = { };

    const promise = new Promise<T>((resolve, reject) =>
    {
        latePromise.resolve = resolve;
        latePromise.reject  = reject;
    });

    latePromise.promise = promise;

    return latePromise as LatePromise<T>;
}

Using the `async` pipe is not always possible. Sometimes we simply have to manually subscribe to observables.
In turn, this means manually unsubscribing to avoid memory leaks.

There are different approaches out there to unsubscribe, but the end result is always the same... Import something, declare a variable, implement `ngOnDestroy()`, use when subscribing.

`Destroyable` saves us time on implementing boilerplate code and lets you easily subscribe to an observable without any headaches.

# How to Use
Once your class extends `Destroyable`, you will be able choose between:
1. Piping `takeUntil(this.destroyed)`.
2. Simply subscribe using `this.subscribe(...)`.

In the following example, both methods will create an observable that will unsubscribe on destroy:

```typescript
import { Destroyable } from '@bespunky/angular-zen/core';

@Component({...})
export class YourComponent extends Destroyable
{
    public takeUntilDestroyed(): void
    {
        interval(1000).pipe(takeUntil(this.destroyed)).subscribe();
    }

    public subscribeUntilDestroyed(): void
    {
        this.subscribe(interval(1000));
    }
}
```

> If you need to provide your own implementation for `ngOnDestroy()` make sure you call `super.ngOnDestroy()` in your implementation.
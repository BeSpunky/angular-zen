import { Subject, Observable, Subscription, PartialObserver } from 'rxjs';
import { takeUntil                                          } from 'rxjs/operators';
import { OnDestroy                                          } from '@angular/core';

export abstract class Destroyable implements OnDestroy
{
    protected destroyed: Subject<void> = new Subject();

    ngOnDestroy()
    {
        this.destroyed.next();
        this.destroyed.complete();
    }

    protected subscribe<T>(observable: Observable<T>, pipeOrObserver: ((destroyable: Observable<T>) => Observable<any>) | PartialObserver<T> , observer?: PartialObserver<T>): Subscription
    {
        const destroyeable = observable.pipe(takeUntil(this.destroyed));

        // If a pipe function was provided...
        return pipeOrObserver instanceof Function ?
                // ... use it to aggregate pipes, then subscribe
                    pipeOrObserver(destroyeable).subscribe(observer) :
                // otherwise, subscribe to the destroyable observable immediately    
                    destroyeable.subscribe(pipeOrObserver);
    }
}
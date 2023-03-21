import { finalize, Observable } from 'rxjs';

// Replicated a minimal version of zone.js for half-strong-typing sake.
declare const Zone: {
    current: {
        scheduleMacroTask(...args: unknown[]): { invoke(): unknown; }
    } 
};

export function wrapInMacroTask<T>(observable: Observable<T>, macroTaskNamePrefix: string): Observable<T>
{
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    const macroTask = Zone.current.scheduleMacroTask(`${ macroTaskNamePrefix }-${ Math.random() }`, () => {}, {}, () => {}, () => {});

    // Signal end of macro task on completion or error and allow server to return
    return observable.pipe(finalize(() => macroTask.invoke()));
}

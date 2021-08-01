import { Notification } from 'rxjs';
import { ObserverName } from './general';

/** Maps RxJS materialized notification states to their observer handler name. */
const StateNotificationMap: Record<'N' | 'E' | 'C', ObserverName> = {
    N: 'next',
    E: 'error',
    C: 'complete'
};

/**
 * Represents an intercepted observer call made by a materialized observable.
 *
 * @export
 * @class ObserverCall
 * @template T The type of value emitted by the materialized observable.
 */
export class ObserverCall<T>
{
    /**
     *  Creates an instance of ObserverCall.
     */
    /**
     *  Creates an instance of ObserverCall.
     * @param {ObserverName} name 
     * @param {T} [value] 
     */
    private constructor(
        /**
         * The name of the intercepted observer call.
         * 
         * @type {ObserverName}
         **/
        public readonly name: ObserverName,
        /**
         * (Optional) The value, if any, emitted by the observable.
         * 
         * @type {T}
         * @template T The type of value emitted by the observable.
         */
        public readonly value?: T
    ) { }

    /**
     * Creates an ObserverCall representing the resolving state of an observable.
     *
     * @static
     * @template T The type of value emitted by the observable.
     * @return {ObserverCall<T>} 
     */
    public static resolving<T>(): ObserverCall<T>
    {
        return new ObserverCall<T>('resolving');
    }

    /**
     * Extracts the data from a materialized observable notification and creates an `ObserverCall` representation for it.
     *
     * @static
     * @template T The type of value emitted by the observable.
     * @param {Notification<T>} notification The notification received from the materialized observable.
     * @return {ObserverCall<T>} An `ObserverCall` representing the notification and its data.
     */
    public static fromNotification<T>({ kind, value, error }: Notification<T>): ObserverCall<T>
    {
        return new ObserverCall(StateNotificationMap[kind], error || value);
    }
}

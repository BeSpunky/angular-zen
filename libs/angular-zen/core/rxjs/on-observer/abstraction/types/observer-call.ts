import { Notification } from 'rxjs';
import { ObserverName } from './general';

const StateNotificationMap: Record<'N' | 'E' | 'C', ObserverName> = {
    N: 'next',
    E: 'error',
    C: 'complete'
};

export class ObserverCall<T> {
    public readonly timestamp = Date.now();

    constructor(
        public readonly name: ObserverName,
        public readonly value?: T
    ) { }

    public static resolving<T>(): ObserverCall<T>
    {
        return new ObserverCall<T>('resolving');
    }

    public static fromNotification<T>({ kind, value, error }: Notification<T>): ObserverCall<T>
    {
        return new ObserverCall(StateNotificationMap[kind], error || value);
    }
}

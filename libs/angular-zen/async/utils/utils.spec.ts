import { promiseLater } from './promiseLater';

describe('promiseLater()', () =>
{
    it('should return a promise with a `resolve()` and `reject()` methods', () =>
    {
        const later = promiseLater();

        expect(later.promise instanceof Promise).toBeTruthy();
        expect(later.resolve instanceof Function).toBeTruthy();
        expect(later.reject instanceof Function).toBeTruthy();
    });

    it('should return a `resolve()` method that acts on the returned promise', (done: DoneFn) =>
    {
        const later = promiseLater();

        later.promise.then((value) =>
        {
            expect(value).toBe('resolved');
            done();
        });

        later.resolve('resolved');
    });

    it('should return a `reject()` method that acts on the returned promise', (done: DoneFn) =>
    {
        const later = promiseLater();

        later.promise.then(() => void 0, (reason) => {
            expect(reason).toBe('rejected');
            done();
        });

        later.reject('rejected');
    });
});

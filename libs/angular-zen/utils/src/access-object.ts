function isArrayIndexer(path: string): boolean
{
    const numericIndexerRegex = /^\w+\[\d+\]$/;

    return numericIndexerRegex.test(path);
}

function accessArrayProperty<T>(value: unknown, arrayPath: string)
{
    if (!value) throw new Error(`Cannot access ${ arrayPath }. 'value' is ${ value }`);

    if (typeof value !== 'object') throw new Error(`Cannot access ${ arrayPath }. ${ value } is not an object.`);

    const pathRegex = /^(?<property>(\w+))\[(?<index>(\d+))\]$/;

    const lookup = pathRegex.exec(arrayPath)?.groups;
    
    if (!(lookup && lookup['property'] && lookup['index']))
        throw new Error(`
            Tried to access array on at '${ arrayPath }', but the path is invalid.
            Expected a path of the shape 'propertyName[index].'
        `);
    
    const { property, index } = lookup;

    const array = (value as Record<string, unknown>)[property];

    if (!Array.isArray(array)) throw new TypeError(`Array property access failed. Value at '${ property }' is not an array.`);

    return {
        get: (): T => array[+index],
        set: (newValue: T) => array[+index] = newValue
    };
}

export function access<T>(value: Record<string, unknown>, path: string)
{
    if (!path) return { get: (): T => value as T, set: () => void 0 };

    const parts = path.split('.').filter(part => part !== '');

    while (parts.length > 1)
    {
        const nextPath = parts.shift() as string;

        if (typeof value !== 'object') throw new Error(``);

        value = (isArrayIndexer(nextPath) ? accessArrayProperty(value, nextPath).get() : value[nextPath]) as Record<string, unknown>;
    }

    const lastPath = parts.shift() as string;

    return {
        get: isArrayIndexer(lastPath)
            ? (): T => accessArrayProperty(value, lastPath).get() as T
            : (): T => value[lastPath] as T,
        set: isArrayIndexer(lastPath)
            ? (newValue: T) => accessArrayProperty<T>(value, lastPath).set(newValue)
            : (newValue: T) => value[lastPath] = newValue
    }
}
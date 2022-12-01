export function touchFirstLetter([ firstLetter, ...rest ]: string, touch: (first: string) => string): string
{
    return firstLetter ? touch(firstLetter) + rest.join('') : '';
}

export function firstUpper(value: string): string
{
    return touchFirstLetter(value, first => first.toUpperCase());
}

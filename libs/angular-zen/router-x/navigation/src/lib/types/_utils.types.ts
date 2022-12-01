export type Primitive = undefined | null | number | bigint | boolean | string;

export type Narrow<T> =
    T extends Primitive | [] | ((...args: any[]) => any)
    ? T
    : { [ K in keyof T ]: Narrow<T[ K ]>; };

export type AsObject<T> = {
    [ k in keyof T ]: T[ k ];
};

export type EmptyObject = Record<string, never>;
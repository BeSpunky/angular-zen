
export type Head<T> = T extends [ infer First, ...infer _ ] ? First : unknown;
export type Tail<T> = T extends [ ...infer _, infer Last ] ? Last : unknown;
export type NoHead<T> = T extends [ infer _, ...infer Rest ] ? Rest : unknown;
export type NoTail<T> = T extends [ ...infer Rest, infer _ ] ? Rest : unknown;

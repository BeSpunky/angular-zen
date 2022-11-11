
export type FirstChar<T> = T extends `${ infer First }${ string }` ? First : unknown;
export type LastChar<T> = T extends `${ string }${ infer Last }` ? Last : unknown;

export type Split<S extends string, Separator extends string> = S extends `` ? [] : S extends `${ Separator }${ infer Rest }` ? Split<Rest, Separator> : S extends `${ infer Part }${ Separator }${ infer Rest }` ? [ Part, ...Split<Rest, Separator> ] : S extends `${ infer Part }` ? [ Part ] : string[];

export type Join<Strings extends string[], Separator extends string> = Strings extends [ infer S, ...infer Rest ] ? S extends string ? Rest extends string[] ? Rest[ 'length' ] extends 0 ? S : `${ S }${ Separator }${ Join<Rest, Separator> }` : S : never : '';

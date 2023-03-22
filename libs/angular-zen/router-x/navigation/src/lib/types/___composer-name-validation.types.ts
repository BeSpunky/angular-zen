type CharArray<S extends string> = {
    0: [ '' ];
    1: [ S ];
    more: S extends `${ infer First }${ infer Rest }` ? [ First, ...CharArray<Rest> ] : never;
}[ S[ 'length' ] extends 0 | 1 ? S[ 'length' ] : 'more' ];

type DigitChar = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';
type LetterChar = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';

export type ValidRouteNameChar = DigitChar |
    LetterChar |
    Capitalize<LetterChar> |
    '-' | '_' |
    '';

// type ValidRouteName<Name extends string> =
//     Name extends `${ infer Char }${ infer Rest }` ?
//     Char extends ValidRouteNameChar ? JoinStrings<Char, ValidRouteName<Rest>> : `{${ Char }}${Rest} - The char wrapped in brackets is invalid for route names.` : '';

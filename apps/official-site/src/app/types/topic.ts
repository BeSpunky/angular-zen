import { Example } from "./example";

export interface Topic
{
    title      : string;
    description: string;
    icon       : string;
    examples   : Example[];
}

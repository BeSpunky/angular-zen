import { MockElement } from './element.mock';

export class MockScriptElement extends MockElement
{
    constructor() { super('script'); }
    
    async?: boolean;
    defer?: boolean;
    src?  : string;
    type? : string;

    onload? : () => void;
    onerror?: () => void;
}

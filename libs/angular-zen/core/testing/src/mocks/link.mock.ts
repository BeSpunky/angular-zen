import { MockElement } from './element.mock';

export class MockLinkElement extends MockElement
{
    constructor() { super('link'); }

    as  ?: string;
    href?: string;
    type?: string;
    rel ?: string;
    relList = {
        add: (...tokens: string[]) => this.rel = tokens.join(' ')
    };
    
    onload ?: () => void;
    onerror?: () => void;
}
export class MockLinkTag
{
    href: string;
    type: string;
    rel: string;
    relList = {
        add: (...tokens: string[]) => this.rel = tokens.join(',')
    };
    
    onload: () => void;
    onerror: () => void;
}
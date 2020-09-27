export class MockElement
{
    public parentElement: MockElement;
    public children     : any[] = [];

    public dir: 'ltr' | 'rtl';
    public className: string;

    constructor(public tagName?: string) { }

    public remove(): void
    {
        if (this.parentElement) this.parentElement.removeChild(this);
    }

    public removeChild(node: any): void
    {
        if (node.parentElement !== this) return;

        const index = this.children.indexOf(node);

        if (index > -1)
        {
            this.children.splice(index, 1);

            node.parentElement = null;
        }
    }

    public appendChild(node: any): void
    {
        this.children.push(node);

        node.parentElement = this;

        if (node.onload instanceof Function) setTimeout(node.onload, 0);
    }

    public querySelectorAll(selector: string): any[]
    {
        throw new Error(`
            Providing a general implementation for querySelectorAll() to support all cases is to complex.
            Use spyOn() and fake this to provide an implementation for the specific use case.
            See MockElement.extractXXXFromSelector() methods for utils.
        `);
    }

    /**
     * Extracts an array of {name, value} objects mapping the attributes from the specified selector string.
     * Attributes with no value will be mapped with wildcard value (i.e. '**').
     *
     * @param {string} selector
     * @returns {*}
     */
    public extractAttributesFromSelector(selector: string): any
    {
        // Searches for [key="value"] and [key] groups and extracts the attribute and value from each
        const regex = /(?:(\[(?<attr>\w+)(?:="(?<value>[^\]]+)")?)\]*)/g;
        let match: RegExpExecArray;
        
        const attributes = [];
        
        while ((match = regex.exec(selector)) !== null)
        {
            // This is necessary to avoid infinite loops with zero-width matches
            if (match.index === regex.lastIndex) regex.lastIndex++;

            attributes.push({ name: match.groups.attr, value: match.groups.value || '**' });
        }

        return attributes;
    }
}
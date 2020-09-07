export class MockScriptTag
{
    async: boolean;
    defer: boolean;
    src: string;
    type: string;

    onload: () => void;
    onerror: () => void;
}

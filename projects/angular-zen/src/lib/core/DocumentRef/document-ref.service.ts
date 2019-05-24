import { Injectable } from '@angular/core';

function getDocument()
{
    return document;
}

@Injectable({
    providedIn: 'root'
})
export class DocumentRef
{
    get nativeDocument(): any
    {
        return getDocument();
    }
}

import { Component, OnInit } from '@angular/core';
import { DocumentRef } from '@bespunky/angular-zen/core';

@Component({
    selector: 'zen-document-ref-demo',
    templateUrl: './document-ref-demo.component.html',
    styleUrls: ['./document-ref-demo.component.css']
})
export class DocumentRefDemoComponent implements OnInit
{
    public title: string;

    constructor(private documentRef: DocumentRef) { }

    ngOnInit()
    {
        this.title = this.documentRef.nativeDocument.title;
    }
}

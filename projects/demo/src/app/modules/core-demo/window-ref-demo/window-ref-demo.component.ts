import { Component, OnInit } from '@angular/core';
import { WindowRef } from '@bespunky/angular-zen/core';

@Component({
    selector: 'zen-window-ref-demo',
    templateUrl: './window-ref-demo.component.html',
    styleUrls: ['./window-ref-demo.component.css']
})
export class WindowRefDemoComponent implements OnInit
{
    public screen: any;

    constructor(private windowRef: WindowRef) { }

    ngOnInit()
    {
        this.screen = this.windowRef.nativeWindow.screen;
    }
}

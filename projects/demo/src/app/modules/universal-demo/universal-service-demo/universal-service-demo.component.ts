import { Component } from '@angular/core';
import { UniversalService } from '@bespunky/angular-zen';

@Component({
    selector: 'zen-universal-service-demo',
    templateUrl: './universal-service-demo.component.html',
    styleUrls: ['./universal-service-demo.component.css']
})
export class UniversalServiceDemoComponent
{
    constructor(public universal: UniversalService) { }
}

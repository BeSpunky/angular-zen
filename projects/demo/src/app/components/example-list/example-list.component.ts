import { Component, Input } from '@angular/core';

export interface CardInfo
{
    title    : string;
    subtitle?: string;
    icon     : string;
    content  : string;
    soon?    : boolean;
}

@Component({
    selector   : 'demo-example-list',
    templateUrl: './example-list.component.html',
    styleUrls  : ['./example-list.component.scss']
})
export class ExampleListComponent
{
    @Input() public cards: CardInfo[];
}

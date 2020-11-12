import { Component, Input } from '@angular/core';
import { Benefit          } from '../../types/benefit';

@Component({
    selector   : 'demo-library-benefits',
    templateUrl: './library-benefits.component.html',
    styleUrls  : ['./library-benefits.component.scss']
})
export class LibraryBenefitsComponent
{
    @Input() public benefits: Benefit[];
}

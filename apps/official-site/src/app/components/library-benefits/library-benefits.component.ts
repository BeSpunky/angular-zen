import { Component, Input } from '@angular/core';
import { Benefit          } from '../../types/benefit';

@Component({
    selector   : 'app-library-benefits',
    templateUrl: './library-benefits.component.html',
    styleUrls  : ['./library-benefits.component.scss']
})
export class LibraryBenefitsComponent
{
    @Input() public benefits: Benefit[] = [];
}

import { map, Observable } from 'rxjs';
import { Component, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector   : 'bs-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls  : ['./user-profile.component.scss'],
})
export class UserProfileComponent
{
    public id: Observable<number>;

    constructor(private route: ActivatedRoute)
    {
        this.id = this.route.paramMap.pipe(map(params => Number(params.get('id'))));
    }
}

@NgModule({
    imports     : [CommonModule],
    declarations: [UserProfileComponent],
    exports     : [UserProfileComponent],
})
export class UserProfileComponentModule {}

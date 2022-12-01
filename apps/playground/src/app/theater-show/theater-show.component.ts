import { map, Observable } from 'rxjs';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector   : 'bs-theater-show',
    templateUrl: './theater-show.component.html',
    styleUrls  : ['./theater-show.component.scss'],
})
export class TheaterShowComponent
{
    public theaterId: Observable<number>;
    public showId: Observable<number>;

    constructor(private route: ActivatedRoute)
    {
        this.theaterId = this.route.paramMap.pipe(map(params => Number(params.get('theaterId'))));
        this.showId = this.route.paramMap.pipe(map(params => Number(params.get('id'))));
    }
}
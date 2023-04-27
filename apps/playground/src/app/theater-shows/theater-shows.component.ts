import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// theater-shows.component.ts
// The possible query parameters for the theater shows route
export interface TheaterShowsFilter
{
    search: string;
    toolbar: boolean;
}

@Component({
    selector: 'bs-theater-shows',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './theater-shows.component.html',
    styleUrls: ['./theater-shows.component.scss'],
})
export class TheaterShowsComponent
{

}

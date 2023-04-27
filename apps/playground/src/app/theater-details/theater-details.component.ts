import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'bs-theater-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './theater-details.component.html',
    styleUrls: ['./theater-details.component.scss'],
})
export class TheaterDetailsComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}

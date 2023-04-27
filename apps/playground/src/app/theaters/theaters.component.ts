import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'bs-theaters',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './theaters.component.html',
    styleUrls: ['./theaters.component.scss'],
})
export class TheatersComponent implements OnInit {
    constructor() {}

    ngOnInit(): void {}
}

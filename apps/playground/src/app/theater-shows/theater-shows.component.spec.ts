import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterShowsComponent } from './theater-shows.component';

describe('TheaterShowsComponent', () => {
    let component: TheaterShowsComponent;
    let fixture: ComponentFixture<TheaterShowsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TheaterShowsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TheaterShowsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

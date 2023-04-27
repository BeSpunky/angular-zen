import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TheaterDetailsComponent } from './theater-details.component';

describe('TheaterDetailsComponent', () => {
    let component: TheaterDetailsComponent;
    let fixture: ComponentFixture<TheaterDetailsComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TheaterDetailsComponent],
        }).compileComponents();

        fixture = TestBed.createComponent(TheaterDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});

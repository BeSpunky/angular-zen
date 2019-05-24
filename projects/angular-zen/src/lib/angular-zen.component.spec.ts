import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AngularZenComponent } from './angular-zen.component';

describe('AngularZenComponent', () => {
  let component: AngularZenComponent;
  let fixture: ComponentFixture<AngularZenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AngularZenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AngularZenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

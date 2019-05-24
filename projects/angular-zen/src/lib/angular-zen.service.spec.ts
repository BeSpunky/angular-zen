import { TestBed } from '@angular/core/testing';

import { AngularZenService } from './angular-zen.service';

describe('AngularZenService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AngularZenService = TestBed.get(AngularZenService);
    expect(service).toBeTruthy();
  });
});

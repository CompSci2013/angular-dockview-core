import { TestBed } from '@angular/core/testing';

import { AngularDockviewService } from './angular-dockview.service';

describe('AngularDockviewService', () => {
  let service: AngularDockviewService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AngularDockviewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

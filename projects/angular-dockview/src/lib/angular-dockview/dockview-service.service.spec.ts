import { TestBed } from '@angular/core/testing';

import { DockviewServiceService } from './dockview-service.service';

describe('DockviewServiceService', () => {
  let service: DockviewServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DockviewServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

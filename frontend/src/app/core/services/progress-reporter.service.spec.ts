import { TestBed } from '@angular/core/testing';

import { ProgressReporterService } from './progress-reporter.service';

describe('ProgressReporterService', () => {
  let service: ProgressReporterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProgressReporterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

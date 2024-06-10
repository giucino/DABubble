import { TestBed } from '@angular/core/testing';

import { CursorPositionService } from './cursor-position.service';

describe('CursorPositionService', () => {
  let service: CursorPositionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CursorPositionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

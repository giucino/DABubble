import { TestBed } from '@angular/core/testing';

import { NewMessageAdresseesService } from './new-message-adressees.service';

describe('NewMessageAdresseesService', () => {
  let service: NewMessageAdresseesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NewMessageAdresseesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

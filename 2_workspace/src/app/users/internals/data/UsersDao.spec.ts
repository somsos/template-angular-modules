import { TestBed } from '@angular/core/testing';

import { UsersDao } from './UsersDao';

describe('UsersDao', () => {
  let service: UsersDao;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsersDao);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

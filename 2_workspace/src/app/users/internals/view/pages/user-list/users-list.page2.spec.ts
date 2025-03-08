import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersListPage2 } from './users-list.page';

describe('UsersListPage', () => {
  let component: UsersListPage2;
  let fixture: ComponentFixture<UsersListPage2>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersListPage2]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UsersListPage2);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

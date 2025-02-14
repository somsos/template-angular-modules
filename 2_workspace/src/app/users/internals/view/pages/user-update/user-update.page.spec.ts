import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserUpdatePage } from './user-update.page';

describe('UserUpdatePage', () => {
  let component: UserUpdatePage;
  let fixture: ComponentFixture<UserUpdatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserUpdatePage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

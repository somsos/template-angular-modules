import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductUpdatePage } from './product-update.page';

describe('ProductUpdatePage', () => {
  let component: ProductUpdatePage;
  let fixture: ComponentFixture<ProductUpdatePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductUpdatePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductUpdatePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

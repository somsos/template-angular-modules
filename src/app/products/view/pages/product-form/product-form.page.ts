import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../domain/ProductsStateService';
import { ProductDto } from '../../../commons/ProductDto';
import { filter, first, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.page.html',
  styleUrl: './product-form.page.scss',
})
export class ProductFormPage {
  private readonly _productSrv = inject(ProductsService);
  private readonly _router = inject(Router);

  onAdd() {
    const newOnForm = ProductDto.createRandomProductToSave();
    const addReq: Observable<ProductDto> = this._productSrv.save(newOnForm);
    this._observeSuccess(addReq);
  }

  private _observeSuccess(addReq: Observable<ProductDto>): void {
    addReq
      .pipe(
        filter((p) => p !== undefined && p.id != undefined),
        first()
      )
      .subscribe({
        complete: () => {
          this._onAddSuccess();
        },
      });
  }

  private _onAddSuccess(): void {
    this._router.navigateByUrl('products');
  }
}

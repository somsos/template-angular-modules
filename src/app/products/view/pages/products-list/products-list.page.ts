import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../domain/ProductsStateService';
import { Observable, tap } from 'rxjs';
import { ProductDto } from '../../../commons/ProductDto';
import { Router } from '@angular/router';
import { LayoutService } from '../../../../0common/layout/domain/LayoutService';
import { ILayoutService } from '../../../../0common/layout/common/ILayoutService';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.page.html',
  styleUrl: './products-list.page.scss',
})
export class ProductsListPage {
  private readonly _productsStateSrv = inject(ProductsService);
  private readonly _route = inject(Router);
  private readonly _layoutSrv: ILayoutService = inject(LayoutService);

  public productsList$: Observable<ProductDto[]> = this._observeProductsList();

  private _observeProductsList(): Observable<ProductDto[]> {
    return this._productsStateSrv.getAll();
  }

  goToAdd() {
    this._route.navigateByUrl('products/add');
  }

  onClickDelete(id: number) {
    const msg = '¿Realmente quieres eliminar este producto?';
    const sub = this._layoutSrv.askConfirmation(msg).subscribe((confirm) => {
      if (confirm) {
        this._productsStateSrv.deleteById(id).subscribe({
          complete: () => {
            this.productsList$ = this._observeProductsList();
          },
        });
      }
      sub.unsubscribe();
    });
  }
}

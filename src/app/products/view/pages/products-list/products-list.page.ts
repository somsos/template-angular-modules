import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../domain/ProductsStateService';
import { Observable, tap } from 'rxjs';
import { ProductDto } from '../../../commons/ProductDto';
import { Router } from '@angular/router';

@Component({
  selector: 'app-products-list',
  templateUrl: './products-list.page.html',
  styleUrl: './products-list.page.scss',
})
export class ProductsListPage {
  private _productsStateSrv = inject(ProductsService);
  private _route = inject(Router);

  public productsList$: Observable<ProductDto[]> = this._observeProductsList();

  private _observeProductsList(): Observable<ProductDto[]> {
    return this._productsStateSrv.getAll();
  }

  goToAdd() {
    this._route.navigateByUrl('products/add');
  }
}

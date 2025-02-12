import { Component, inject } from '@angular/core';
import { ProductsService } from '../../../domain/ProductsStateService';
import { ProductDto } from '../../../commons/ProductDto';
import {
  delay,
  filter,
  first,
  Observable,
  Observer,
  of,
  switchMap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { StringUtils } from '../../../../0common/utils/StringUtils';

@Component({
  selector: 'product-update-page',
  templateUrl: './product-update.page.html',
  styleUrl: './product-update.page.scss',
})
export class ProductUpdatePage {
  private readonly _productSrv = inject(ProductsService);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);

  public readonly found$ = this._findProductByUrlPathId();

  private _findProductByUrlPathId(): Observable<ProductDto> {
    return this._activatedRoute.params.pipe(
      switchMap((s) => {
        const idInPath = StringUtils.toNumber(s['id']);
        return this._productSrv.getById(idInPath);
      })
    );
  }

  onBack() {
    this._router.navigateByUrl('products');
  }

  onUpdate(newInfo: ProductDto) {
    const sub = this._productSrv.update(newInfo).subscribe({
      complete: () => {
        console.debug('update successful completed');
        sub.unsubscribe();
      },
    });
  }
}

import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductDto } from '../commons/ProductDto';
import { ProductDao } from '../data/ProductDao';

@Injectable({ providedIn: 'root' })
export class ProductsService {
  private _dao = inject(ProductDao);

  getAll(): Observable<ProductDto[]> {
    return this._dao.getAll();
  }

  save(toAdd: ProductDto): Observable<ProductDto> {
    return this._dao.save(toAdd);
  }
}

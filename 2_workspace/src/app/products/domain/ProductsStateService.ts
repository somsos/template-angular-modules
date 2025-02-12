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

  getById(idInPath: number): Observable<ProductDto> {
    return this._dao.getById(idInPath);
  }

  deleteById(id: number): Observable<ProductDto> {
    return this._dao.deleteById(id);
  }

  update(newInfo: ProductDto): Observable<ProductDto> {
    return this._dao.update(newInfo);
  }
}

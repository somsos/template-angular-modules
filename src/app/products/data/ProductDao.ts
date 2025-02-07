import { Injectable, inject } from '@angular/core';
import { first, Observable, of } from 'rxjs';
import { ProductDto } from '../commons/ProductDto';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductDao {
  public static readonly pathAll = 'api/v1/products/all';
  public static readonly pathSave = 'api/v1/products/all';

  private _http = inject(HttpClient);

  getAll(): Observable<ProductDto[]> {
    return this._http.get<ProductDto[]>(ProductDao.pathAll).pipe(first());
  }

  save(toAdd: ProductDto): Observable<ProductDto> {
    return this._http
      .post<ProductDto>(ProductDao.pathSave, toAdd)
      .pipe(first());
  }
}

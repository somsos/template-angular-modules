import { Injectable, inject } from '@angular/core';
import { first, Observable, of } from 'rxjs';
import { ProductDto } from '../commons/ProductDto';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class ProductDao {
  public static readonly pathRoot = 'api/v1/products';
  public static readonly pathId = 'api/v1/products/${id}';

  private _http = inject(HttpClient);

  getAll(): Observable<ProductDto[]> {
    return this._http.get<ProductDto[]>(ProductDao.pathRoot).pipe(first());
  }

  save(toAdd: ProductDto): Observable<ProductDto> {
    return this._http
      .post<ProductDto>(ProductDao.pathRoot, toAdd)
      .pipe(first());
  }

  getById(id: number): Observable<ProductDto> {
    const url = ProductDao.pathId.replace('${id}', id + '');
    return this._http.get<ProductDto>(url).pipe(first());
  }

  deleteById(id: number): Observable<ProductDto> {
    const url = ProductDao.pathId.replace('${id}', id + '');
    return this._http.delete<ProductDto>(url).pipe(first());
  }
}

import { Injectable, inject } from '@angular/core';
import { first, Observable, of } from 'rxjs';
import { ProductDto } from '../commons/ProductDto';
import { HttpClient } from '@angular/common/http';
import { Endpoint } from '../../0common';

@Injectable({ providedIn: 'root' })
export class ProductDao {
  public static readonly pathRoot = 'api/v1/products';
  public static readonly pathId = 'api/v1/products/${id}';

  public static readonly endPoints = new Map<string, Endpoint>([
    [ "getAll", {method: 'GET', url: ProductDao.pathRoot, auth: false} ],
    [ "getById", {method: 'GET', url: ProductDao.pathId, auth: false} ],
    [ "save", {method: 'POST', url: ProductDao.pathRoot, auth: true} ],
    [ "deleteById", {method: 'DELETE', url: ProductDao.pathId, auth: true} ],
    [ "update", {method: 'PUT', url: ProductDao.pathRoot, auth: true} ],
]);

  private _http = inject(HttpClient);

  getAll(): Observable<ProductDto[]> {
    const { method, url } = ProductDao.endPoints.get("getAll")!;
    return this._http.request<ProductDto[]>(method, url).pipe(first());
  }

  save(toAdd: ProductDto): Observable<ProductDto> {
    const { method, url } = ProductDao.endPoints.get("save")!;
    const options = { body: toAdd };
    return this._http.request<ProductDto>(method, url, options).pipe(first());
  }

  getById(id: number): Observable<ProductDto> {
    const { method, url } = ProductDao.endPoints.get("getById")!;
    const urlWithVal = url.replace('${id}', id + '');
    return this._http.request<ProductDto>(method, urlWithVal).pipe(first());
  }

  deleteById(id: number): Observable<ProductDto> {
    const { method, url } = ProductDao.endPoints.get("deleteById")!;
    const urlWithVal = url.replace('${id}', id + '');
    return this._http.request<ProductDto>(method, urlWithVal).pipe(first());
  }

  update(newInfo: ProductDto): Observable<ProductDto> {
    const { method, url } = ProductDao.endPoints.get("update")!;
    const urlWithVal = url.replace('${id}', newInfo.id + '');
    const options = { body: newInfo };
    return this._http
      .request<ProductDto>(method, urlWithVal, options)
      .pipe(first());
  }
}

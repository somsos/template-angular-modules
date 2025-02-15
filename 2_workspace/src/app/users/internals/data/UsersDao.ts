import { inject, Injectable } from '@angular/core';
import { IUserDto } from '../commons/IUserDto';
import { first, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Endpoint } from '../../../0common';
import { UserAdd } from '../commons/UserAdd';

@Injectable({
  providedIn: 'root'
})
export class UsersDao {

  private readonly _http = inject(HttpClient);

    public static readonly pathRoot = 'api/v1/users';
    public static readonly pathId = 'api/v1/users/${id}';

    public static readonly endPoints = new Map<string, Endpoint>([
      [ "getAll", {method: 'GET', url: UsersDao.pathRoot, auth: false} ],
      [ "getById", {method: 'GET', url: UsersDao.pathId, auth: false} ],
      [ "save", {method: 'POST', url: UsersDao.pathRoot, auth: true} ],
      [ "deleteById", {method: 'DELETE', url: UsersDao.pathId, auth: true} ],
      [ "update", {method: 'PUT', url: UsersDao.pathRoot, auth: true} ],
  ]);

  getAll(): Observable<IUserDto[]> {
    const { method, url } = UsersDao.endPoints.get("getAll")!;
    return this._http.request<IUserDto[]>(method, url).pipe(first());
  }

  getById(id: number): Observable<IUserDto> {
    const { method, url } = UsersDao.endPoints.get("getById")!;
    const urlWithVal = url.replace('${id}', id + '');
    return this._http.request<IUserDto>(method, urlWithVal).pipe(first());
  }

  save(toAdd: UserAdd): Observable<IUserDto> {
    const { method, url } = UsersDao.endPoints.get("save")!;
    const options = { body: toAdd };
    return this._http.request<IUserDto>(method, url, options).pipe(first());
  }

  update(newInfo: IUserDto): Observable<IUserDto> {
    const { method, url } = UsersDao.endPoints.get("update")!;
    const urlWithVal = url.replace('${id}', newInfo.id + '');
    const options = { body: newInfo };
    return this._http.request<IUserDto>(method, urlWithVal, options).pipe(first());
  }

  deleteById(id: number): Observable<IUserDto> {
    const { method, url } = UsersDao.endPoints.get("deleteById")!;
    const urlWithVal = url.replace('${id}', id + '');
    return this._http.request<IUserDto>(method, urlWithVal).pipe(first());
  }

}

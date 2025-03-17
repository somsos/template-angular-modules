import { inject, Injectable } from '@angular/core';
import { IUserDto } from '../commons/IUserDto';
import { first, Observable, of, switchMap } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Endpoint, IPagePayload, IPageResponse } from '../../../0common';
import { IUserAdd } from '../commons/UserAdd';
import { UsersFileDao } from './UsersFileDao';

@Injectable({
  providedIn: 'root'
})
export class UsersDao {

  private readonly _http = inject(HttpClient);
  private readonly _usersFileDao = inject(UsersFileDao);

    public static readonly pathRoot = 'api/v1/users';
    public static readonly pathId = 'api/v1/users/${id}';

    public static readonly endPoints = new Map<string, Endpoint>([
      [ "getAll", {method: 'GET', url: UsersDao.pathRoot, auth: false} ],
      [ "getById", {method: 'GET', url: UsersDao.pathId, auth: false} ],
      [ "save", {method: 'POST', url: UsersDao.pathRoot, auth: true} ],
      [ "deleteById", {method: 'DELETE', url: UsersDao.pathId, auth: true} ],
      [ "update", {method: 'PUT', url: UsersDao.pathId, auth: true} ],
      [ "uploadImage", { method: 'POST', url: UsersDao.pathId + "/pictures", auth: true } ],
      [ "findPage", { method: 'GET', url: UsersDao.pathRoot + "/page", auth: false } ],
      [ "filterOverAll", { method: 'GET', url: UsersDao.pathRoot + "/filter?q=", auth: false } ],
  ]);

  getAll(): Observable<IUserDto[]> {
    const { method, url } = UsersDao.endPoints.get("getAll")!;
    return this._http.request<IUserDto[]>(method, url).pipe();
  }

  getById(id: number): Observable<IUserDto> {
    const { method, url } = UsersDao.endPoints.get("getById")!;
    const urlWithVal = url.replace('${id}', id + '');
    return this._http.request<IUserDto>(method, urlWithVal).pipe(first());
  }

  save(toAdd: IUserAdd): Observable<IUserDto> {
    const picture = toAdd.pictureFile; // not remove, I don't know why yet in both save and update
    const { method, url } = UsersDao.endPoints.get("save")!;
    const options = { body: toAdd };
    const req = this._http.request<IUserDto>(method, url, options);
    return req.pipe(
      first(),
      switchMap((saved => { // duplicated code
        if(!picture) {
          console.debug("No image to upload");
          return of(saved);
        }
        console.log("File to upload: " + picture.name);
        return this._usersFileDao.uploadImage(saved.id, picture)
          .pipe(switchMap((idImage => {
            saved.pictureId = idImage;
            return of(saved);
          })));
      }))
    );
  }

  update(newInfo: IUserDto): Observable<IUserDto> {
    const picture = newInfo.pictureFile; // not remove, I don't know why yet in both save and update
    const { method, url } = UsersDao.endPoints.get("update")!;
    const urlWithVal = url.replace('${id}', newInfo.id + '');
    const options = { body: newInfo };
    return this._http.request<IUserDto>(method, urlWithVal, options)
      .pipe(
        first(),
        switchMap(uUpdated => { // duplicated code
          if(!picture) {
            return of(uUpdated).pipe(first());
          } else {
            console.log("File to update: " + picture.name);
            return this._usersFileDao.uploadImage(newInfo.id, picture)
              .pipe(first(), switchMap((idImage => {
                uUpdated.pictureId = idImage;
                return of(uUpdated);
              })));
          }
        })
      )
    ;
  }

  deleteById(id: number): Observable<IUserDto> {
    const { method, url } = UsersDao.endPoints.get("deleteById")!;
    const urlWithVal = url.replace('${id}', id + '');
    return this._http.request<IUserDto>(method, urlWithVal).pipe(first());
  }

  findPage(payload: IPagePayload): Observable<IPageResponse<IUserDto>> {
    const { method, url } = UsersDao.endPoints.get("findPage")!;
    console.debug("request, findPage: ", method, url, payload);
    const options = { body: payload };
    return this._http.request<IPageResponse<IUserDto>>(method, url, options).pipe(first());
  }

  filterOverAll(textFilter: string): Observable<IPageResponse<IUserDto>> {
    const { method, url } = UsersDao.endPoints.get("filterOverAll")!;
    //const options = { params: new HttpParams().set('q', textFilter) };
    const urlWParams = url + textFilter;
    return this._http.request<IPageResponse<IUserDto>>(method, urlWParams).pipe(first());
  }

}

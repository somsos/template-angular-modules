import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserDto } from '../commons/IUserDto';
import { UsersDao } from '../data/UsersDao';
import { IUserAdd } from '../commons/UserAdd';
import { IPaginatorService, IPagePayload, IPageResponse } from '../../../0common';

@Injectable({
  providedIn: 'root'
})
export class UsersService implements IPaginatorService<IUserDto> {

  private readonly _dao = inject(UsersDao);

  constructor() { }

  getAll(): Observable<IUserDto[]> {
    return this._dao.getAll();
  }

  getById(id: number): Observable<IUserDto> {
    return this._dao.getById(id);
  }

  save(toAdd: IUserAdd): Observable<IUserDto> {
    return this._dao.save(toAdd);
  }

  update(newInfo: IUserDto): Observable<IUserDto> {
    return this._dao.update(newInfo);
  }

  deleteById(id: number): Observable<IUserDto> {
    return this._dao.deleteById(id);
  }

  findPage(payload: IPagePayload): Observable<IPageResponse<IUserDto>> {
    return this._dao.findPage(payload);
  }

  filterOverAll(textFilter: string): Observable<IPageResponse<IUserDto>> {
    return this._dao.filterOverAll(textFilter);
  }

}

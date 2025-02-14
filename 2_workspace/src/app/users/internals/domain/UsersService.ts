import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUserDto } from '../commons/IUserDto';
import { UsersDao } from '../data/UsersDao';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private readonly _dao = inject(UsersDao);

  constructor() { }

  getAll(): Observable<IUserDto[]> {
    return this._dao.getAll();
  }

  getById(id: number): Observable<IUserDto> {
    return this._dao.getById(id);
  }

  save(toAdd: IUserDto): Observable<IUserDto> {
    return this._dao.save(toAdd);
  }

  update(newInfo: IUserDto): Observable<IUserDto> {
    return this._dao.update(newInfo);
  }

  deleteById(id: number): Observable<IUserDto> {
    return this._dao.deleteById(id);
  }


}

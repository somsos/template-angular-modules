import { filter, first, Observable, of, Subject } from 'rxjs';
import AuthDto from '../common/AuthDto';
import IAuthService from '../common/IAuthService';
import { inject, Injectable } from '@angular/core';
import AuthApiDao from '../data/AuthApiDao';

@Injectable({
  providedIn: 'root',
})
export default class AuthService implements IAuthService {
  private _userLoggedSub = new Subject<AuthDto | undefined>();
  private _authDao = inject(AuthApiDao);

  getUserLogged(): Observable<AuthDto | undefined> {
    return this._userLoggedSub;
  }

  login(toAuth: AuthDto): Observable<AuthDto | undefined> {
    const req = this._authDao.createToken(toAuth).pipe(
      first(),
      filter((r) => r !== undefined)
    );
    req.subscribe({
      next: (logged) => {
        this._userLoggedSub.next(logged);
      },
    });
    return req;
  }
}

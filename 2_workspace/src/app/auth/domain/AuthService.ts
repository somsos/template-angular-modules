import { BehaviorSubject, filter, first, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import AuthApiDao from '../data/AuthApiDao';
import { AuthDto, IAuthService } from '../../0common';

@Injectable({
  providedIn: 'root',
})
export default class AuthService implements IAuthService {
  private readonly _userLoggedSub = new BehaviorSubject<AuthDto | undefined>(undefined);
  private readonly _authDao = inject(AuthApiDao);
  private readonly userAuthInfo = 'userAuthInfo';

  getUserLogged(): Observable<AuthDto | undefined> {
    const onStorage = localStorage.getItem(this.userAuthInfo);
    if (onStorage) {
      const userInStorage: AuthDto = AuthDto.fromAny(JSON.parse(onStorage));
      this._userLoggedSub.next(userInStorage);
    }
    return this._userLoggedSub.asObservable();
  }

  login(toAuth: AuthDto): Observable<AuthDto | undefined> {
    const req = this._authDao.createToken(toAuth).pipe(
      first(),
      filter((r) => r !== undefined)
    );
    req.subscribe({
      next: (logged) => {
        this._setAuthUser(logged);
      },
    });
    return req;
  }

  private _setAuthUser(logged?: AuthDto) {
    if (logged) {
      delete logged.password;
      localStorage.setItem(this.userAuthInfo, JSON.stringify(logged));
    } else {
      localStorage.removeItem(this.userAuthInfo);
    }

    this._userLoggedSub.next(logged);
  }

  logout(): void {
    this._setAuthUser(undefined);
  }

  register(newAuth: AuthDto): Observable<AuthDto> {
    return this._authDao.register(newAuth);
  }

}

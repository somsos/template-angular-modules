import { BehaviorSubject, filter, first, Observable } from 'rxjs';
import { inject, Injectable } from '@angular/core';
import AuthApiDao from '../data/AuthApiDao';
import { AuthDto, IAuthService } from '../../../0common';

@Injectable({
  providedIn: 'root',
})
export default class AuthService implements IAuthService {
  private readonly _userLoggedSub = new BehaviorSubject<AuthDto | undefined>(undefined);
  private readonly _authDao = inject(AuthApiDao);
  private readonly keyStore = 'userAuthInfo';

  getUserLogged(): Observable<AuthDto | undefined> {
    const onStorage = localStorage.getItem(this.keyStore);
    if (onStorage) {
      const userInStorage: AuthDto = AuthDto.fromAny(JSON.parse(onStorage));
      this._userLoggedSub.next(userInStorage);
    }
    return this._userLoggedSub.asObservable();
  }

  getUserAuth(): AuthDto | undefined {
    return this._userLoggedSub.value;
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
      //delete logged.password; // careful it delated the password from DB as well, don't know why yet.
      const toSaveInStore:any = {};
      Object.assign(toSaveInStore, logged);
      delete toSaveInStore.password;
      localStorage.setItem(this.keyStore, JSON.stringify(toSaveInStore));
    } else {
      localStorage.removeItem(this.keyStore);
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

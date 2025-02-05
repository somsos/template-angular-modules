import { Observable } from 'rxjs';
import AuthDto from '../common/AuthDto';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export default class AuthApiDao {
  private _http = inject(HttpClient);

  public createToken(cred: AuthDto): Observable<AuthDto> {
    console.debug('login-request');
    const loginReq = {
      username: cred.username,
      password: cred.password,
    };

    return this._http.post<AuthDto>('/api/auth/login', loginReq);
  }
}

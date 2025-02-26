import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthDto } from '../../0common';

@Injectable({ providedIn: 'root' })
export default class AuthApiDao {
  private _http = inject(HttpClient);

  public createToken(cred: AuthDto): Observable<AuthDto> {
    const loginReq = {
      username: cred.username,
      password: cred.password,
    };

    return this._http.post<AuthDto>('/api/auth/login', loginReq);
  }
}

import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthDto } from '../../../0common';
import { environment } from '../../../../environments/environment';

const backPath = environment.backend.path;

@Injectable({ providedIn: 'root' })
export default class AuthApiDao {
  private _http = inject(HttpClient);

  public static readonly loginPath = backPath + '/auth/create-token';
  public static readonly registerPath = backPath + '/auth/register';

  public createToken(cred: AuthDto): Observable<AuthDto> {
    const loginReq = {
      username: cred.username,
      password: cred.password,
    };
    return this._http.post<AuthDto>(AuthApiDao.loginPath, loginReq);
  }

  public register(newAuth: AuthDto): Observable<AuthDto> {
    return this._http.post<AuthDto>(AuthApiDao.registerPath, newAuth);
  }

}



/*
{
  "id" : 1,
  "username" : "mario1"
  "token" : "xxx",
  "roles" : [
    { "authority" : "xx", "id" : 11 },
    { "authority" : "ROLE_admin_products", "id" : -56 }
  ],
}
*/

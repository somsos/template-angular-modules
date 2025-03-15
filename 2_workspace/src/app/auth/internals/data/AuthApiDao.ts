import { catchError, first, map, Observable } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AppError, AuthDto, IRoleDto } from '../../../0common';
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
    return this._http.post<AuthResponse>(AuthApiDao.loginPath, loginReq)
      .pipe(
        map(resp => this._mapAuthResponse(resp)),
        catchError((err) => {
          if(err instanceof HttpErrorResponse) {
            throw AppError.fromServer(err);
          }
          throw err;
        }),
      );
  }

  private _mapAuthResponse(resp: AuthResponse): AuthDto {
    const mapped: AuthDto = {
      token: resp.token,
      id: resp.user.id,
      roles: resp.user.roles,
      username: resp.user.username
    }
    return mapped
  }


  public register(newAuth: AuthDto): Observable<AuthDto> {
    return this._http.post<AuthDto>(AuthApiDao.registerPath, newAuth)
      .pipe(
        first(),
        catchError((err) => {
          if(err instanceof HttpErrorResponse) {
            throw AppError.fromServer(err);
          }
          throw err;
        }),
      );
  }

}



/*
"token" : "xxx",
"user" : {
  "id" : 1,
  "roles" : [
    { "authority" : "xx", "id" : 11 },
    { "authority" : "ROLE_admin_products", "id" : -56 }
  ],
  "username" : "mario1"
}
*/
interface AuthResponse {
  token: string;
  user : AuthUserResponse;
}

interface AuthUserResponse {
  id: number;
  roles: IRoleDto[];
  username: string;
}

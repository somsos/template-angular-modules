import { HttpRequest, HttpEvent, HttpInterceptor, HttpHandler } from "@angular/common/http";
import { Inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AuthBackendService } from "./AuthBackendService";
import { commonsNames } from "../..";

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    @Inject(commonsNames.IAuthBackendService) private _authBackSrv: AuthBackendService
  ){}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    /**
     * Do NOT forget that to find out if it requires jwt ot not you must add the
     * rutes to AuthBackendService on the module start up.
     */
    const requiereAuth = this._authBackSrv.reqRequireToken(req);
    if(!requiereAuth) {
      console.debug("JWT not required: ", req.url);
      return next.handle(req);
    }

    console.debug("Adding JWT: ", req.url);
    const reqWithAuth = this._authBackSrv.addAuth(req);
    return next.handle(reqWithAuth);
  }

}

/*
export function tokenInterceptor(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const endPoints = Array.from(ProductDao.endPoints.values())
  const requiereAuth = AuthUtils.reqRequireToken(endPoints, req);

  if(requiereAuth) {
    const reqWithAuth = AuthUtils.addAuth(req);
    return next(reqWithAuth);
  }

  return next(req);
}
*/

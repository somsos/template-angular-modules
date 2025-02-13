import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Endpoint, fromRequest, compareEndpoints } from "../../types/Endpoint";
import { IAuthBackendService } from "../externals/IAuthBackendService";

@Injectable()
export class AuthBackendService implements IAuthBackendService {

  private readonly _endpoints: Endpoint[] = [];

  addRoutes(newEps: Endpoint[]): void {
    console.log("adding routes");
    this._endpoints.push(...newEps);
  }

  public reqRequireToken(req: HttpRequest<any>): boolean {
    const reqEp = fromRequest(req);
    const matchRoute = this._endpoints.find((ep=>compareEndpoints(reqEp, ep)));
    if(!matchRoute) {
      return false;
    }
    return matchRoute.auth;
  }

  public addAuth(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = "foo-token";
    const reqWToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return reqWToken;
  }

}

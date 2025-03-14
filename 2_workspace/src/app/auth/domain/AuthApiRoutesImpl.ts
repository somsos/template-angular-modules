import { HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Endpoint, fromRequest, compareEndpoints } from "../../0common/types/Endpoint";
import { IAuthApiRoutes } from "../../0common/auth/externals/IAuthApiRoutes";

@Injectable()
export class AuthApiRoutesImpl implements IAuthApiRoutes {

  private readonly _endpoints: Endpoint[] = [];

  addRoutes(newEps: Endpoint[]): void {
    //console.log("adding routes");
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

}

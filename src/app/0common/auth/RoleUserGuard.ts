import { inject, Inject, Injectable } from "@angular/core";
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from "@angular/router";
import { Observable } from "rxjs";
import { AppError, AuthDto, commonsNames, ErrorDto, IAuthService, ILayoutService } from "..";

type GuardResult = Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree;

@Injectable()
export class RoleUserGuard implements CanActivate {

  private _router = inject(Router);

  constructor(
    @Inject(commonsNames.IAuthService) private _authSrv: IAuthService,
    @Inject(commonsNames.ILayoutService) private _layoutSrv: ILayoutService,

  ) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): GuardResult {
    const currentUser = this._authSrv.getUserAuth();
    const redirect = this._router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
    if(currentUser == undefined) {
      return redirect
    }
    const acceptedRoles = this._getAcceptedRolesOrThrow(route);
    if (AuthDto.hasRoles(currentUser, acceptedRoles)) {
      return true;
    } else {
      const er: ErrorDto = { message: "Prohibido: Sin permisos de acceso", cause: '', typeArg: 403 }
      this._layoutSrv.showError(er);
      return redirect;
    }
  }

  private _getAcceptedRolesOrThrow(route: ActivatedRouteSnapshot): string[] {
    const r = route.data["acceptedRoles"];
    const isArray = r instanceof Array;
    if(!r && !isArray && r.length == 0 && typeof r[0] === "string") {
      const msg = "acceptedRoles not found in guard";
      throw new AppError(msg);
    }
    return r as Array<string>;
  }

}

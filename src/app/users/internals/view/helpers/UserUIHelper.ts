import { inject, Injectable } from "@angular/core";
import { first, Observable, switchMap, tap } from "rxjs";
import { StringUtils } from "../../../../0common";
import { IUserDto } from "../../commons/IUserDto";
import { ActivatedRoute, Router } from "@angular/router";
import { UsersService } from "../../domain/UsersService";

@Injectable({providedIn: 'root'})
export class UserUIHelper {

  private readonly _srv = inject(UsersService);

  private readonly _router = inject(Router);

  public findUserByIdParam(ar: ActivatedRoute): Observable<IUserDto> {
    return ar.params.pipe(
      first(),
      switchMap((s) => {
        const idInPath = StringUtils.toNumber(s['id']);
        const found$ = this._srv.getById(idInPath);
        return found$;
      })
    );
  }

  goToUsers() {
    this._router.navigate(['/users']);
  }

}

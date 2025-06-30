import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Inject, inject, ViewChild } from '@angular/core';
import { debounceTime, filter, Observable, tap } from 'rxjs';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { RequestDto, commonsNames, ILoadingService, IErrorStateService, IAuthService, AuthDto } from '../../../../../0common';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'main-layout-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-layout.page.html',
  styleUrl: './main-layout.page.scss',
})
export class MainLayoutPage {
  private readonly _location = inject(Location);
  private _snackBar = inject(MatSnackBar);
  private readonly _cdr = inject(ChangeDetectorRef);

  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  public readonly loading$: Observable<RequestDto>;

  public auth?: AuthDto;

  constructor(
    @Inject(commonsNames.ILoadingService) private _loadingSrv: ILoadingService,
    @Inject(commonsNames.IErrorStateService) private _errorStateSrv: IErrorStateService,
    @Inject(commonsNames.IAuthService) private _authSrv: IAuthService,
  ) {
    this._authSrv.observeUserLogged().subscribe({
      next: (u) => {
        console.log("User logged", u);
        this.auth = u;
        this._cdr.markForCheck();
      },
    });

    this.loading$ = this._loadingSrv.getRequest().pipe(
      debounceTime(50),
    );
    this._observeErrors();
  }


  private _observeErrors() {
    this._errorStateSrv.getError().pipe(
      debounceTime(50),
      filter(err => err != undefined),
      tap({next: (err) => {
        this.openSnackBar(err.message, "Ok");
      }})
    ).subscribe();
  }

  onLogoutClicked() {
    this._authSrv.logout();
    //this._location.go("/login");
    window.location.href = "/login";
  }

  onThemeSwitchChange(ev: boolean) {
    const theme = ev ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
  }

  closeSideMenu() {
    this.sidenav.close();
  }

  openSnackBar(message: string, action: string): void {
    console.log("showing snack", message, {});
    this._snackBar.open(message, action, { duration: 4000 });
  }

  hasRoles(acceptedRoles: string[]): boolean {
    return AuthDto.hasRoles(this.auth, acceptedRoles);
  }
}

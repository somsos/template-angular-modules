import { ChangeDetectionStrategy, Component, Inject, inject, ViewChild } from '@angular/core';
import { debounceTime, Observable } from 'rxjs';
import { Location } from '@angular/common';
import { MatSidenav } from '@angular/material/sidenav';
import { RequestDto, ErrorDto, commonsNames, ILoadingService, IErrorStateService, IAuthService, AuthDto } from '../../../../0common';
import AuthService from '../../../../auth/domain/AuthService';

@Component({
  selector: 'main-layout-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-layout.page.html',
  styleUrl: './main-layout.page.scss',
})
export class MainLayoutPage {
  private readonly _location = inject(Location);
  private readonly _authSrv: IAuthService = inject(AuthService);
  //private readonly _cdr = inject(ChangeDetectorRef);

  @ViewChild('sidenav')
  sidenav!: MatSidenav;

  public readonly loading$: Observable<RequestDto>;

  public readonly error$: Observable<ErrorDto | undefined>;

  public auth?: AuthDto;

  constructor(
    @Inject(commonsNames.ILoadingService) private _loadingSrv: ILoadingService,
    @Inject(commonsNames.IErrorStateService) private _errorStateSrv: IErrorStateService
  ) {
    this._authSrv.getUserLogged().subscribe({
      next: (u) => {
        this.auth = u;
        //this._cdr.markForCheck();
      },
    });

    this.loading$ = this._loadingSrv.getRequest().pipe(
      debounceTime(50),
    );
    this.error$ = this._errorStateSrv.getError().pipe(debounceTime(50));
  }

  onLogoutClicked() {
    this._authSrv.logout();
    this._location.go(this._location.path());
  }

  onThemeSwitchChange(ev: boolean) {
    const theme = ev ? 'light' : 'dark';
    document.body.setAttribute('data-theme', theme);
  }

  closeSideMenu() {
    this.sidenav.close();
  }

}

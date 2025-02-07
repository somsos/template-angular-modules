import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { debounceTime } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import { LoadingService } from '../../../loadings/internals/LoadingService';
import { ErrorStateService } from '../../../errors/internals/ErrorStateService';
import IAuthService from '../../../../auth/common/IAuthService';
import AuthService from '../../../../auth/domain/AuthService';
import AuthDto from '../../../../auth/common/AuthDto';
import { ILoadingService } from '../../../loadings/ILoadingService';
import { IErrorStateService } from '../../../errors/IErrorStateService';

@Component({
  selector: 'main-layout-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-layout.page.html',
  styleUrl: './main-layout.page.scss',
})
export class MainLayoutPage {
  //private readonly _cdRef = inject(ChangeDetectorRef);
  private readonly _location = inject(Location);
  private readonly _loadingSrv: ILoadingService = inject(LoadingService);
  private readonly _errorStateSrv: IErrorStateService =
    inject(ErrorStateService);
  private readonly _authSrv: IAuthService = inject(AuthService);

  public readonly loading$ = this._loadingSrv
    .getRequest()
    .pipe(debounceTime(50));

  public readonly error$ = this._errorStateSrv
    .getError()
    .pipe(debounceTime(50));

  public authUser?: AuthDto;

  constructor() {
    this._authSrv.getUserLogged().subscribe({
      next: (u) => {
        this.authUser = u;
      },
    });
  }

  logout() {
    this._authSrv.logout();
    this._location.go(this._location.path());
  }
}

import { ChangeDetectionStrategy, Component, Inject, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { debounceTime, Observable } from 'rxjs';
import { CommonModule, Location } from '@angular/common';
import AuthDto from '../../../../../auth/common/AuthDto';
import IAuthService from '../../../../../auth/common/IAuthService';
import AuthService from '../../../../../auth/domain/AuthService';
import { DialogConfirmationComponent } from '../../components/dialog-confirmation/dialog-confirmation.component';
import { commonsNames, ErrorDto, IErrorStateService, ILoadingService, RequestDto } from '../../../..';

@Component({
  selector: 'main-layout-root',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterModule,
    CommonModule,
    DialogConfirmationComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './main-layout.page.html',
  styleUrl: './main-layout.page.scss',
})
export class MainLayoutPage {
  //private readonly _cdRef = inject(ChangeDetectorRef);
  private readonly _location = inject(Location);
  private readonly _authSrv: IAuthService = inject(AuthService);

  public readonly loading$: Observable<RequestDto>;

  public readonly error$: Observable<ErrorDto | undefined>;

  public authUser?: AuthDto;

  constructor(
    @Inject(commonsNames.ILoadingService) private _loadingSrv: ILoadingService,
    @Inject(commonsNames.IErrorStateService) private _errorStateSrv: IErrorStateService
  ) {
    this._authSrv.getUserLogged().subscribe({
      next: (u) => {
        this.authUser = u;
      },
    });

    this.loading$ = this._loadingSrv.getRequest().pipe(debounceTime(50));
    this.error$ = this._errorStateSrv.getError().pipe(debounceTime(50));
  }

  logout() {
    this._authSrv.logout();
    this._location.go(this._location.path());
  }
}

import { Component, inject, Inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import {
  loadingsNames,
  ILoadingService,
  RequestDto,
} from '../../../0common/loadings';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../0common/loadings/internals/LoadingService';
import { ErrorStateService } from '../../../0common/errors/internals/ErrorStateService';
import { IErrorStateService } from '../../../0common/errors';

@Component({
  selector: 'main-layout-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './main-layout.page.html',
  styleUrl: './main-layout.page.scss',
})
export class MainLayoutPage {
  title = 'mod51io';
  private readonly _loadingSrv: ILoadingService = inject(LoadingService);
  private readonly _errorStateSrv: IErrorStateService =
    inject(ErrorStateService);

  public readonly loading$ = this._loadingSrv.getRequest();
  public readonly error$ = this._errorStateSrv.getError();
}

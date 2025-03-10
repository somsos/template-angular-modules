import { ErrorHandler, Inject, inject, Injectable } from '@angular/core';
import { AppError } from '../externals/AppError';
import { ErrorStateService } from './ErrorStateService';
import { ErrorDto } from '../externals/ErrorDto';
import { ErrorType } from '../externals/ErrorType';
import { commonsNames, ILoadingService } from '../..';
import { LoadingService } from '../../loadings/internals/LoadingService';

@Injectable({
  providedIn: 'root',
})
export class ErrorGlobalHandler implements ErrorHandler {

  constructor(
    @Inject(commonsNames.ILoadingService) private _loadingSrv: LoadingService,
    @Inject(commonsNames.IErrorStateService) private _errorSrv: ErrorStateService
  ) { }

  handleError(error: any): void {
    if (error instanceof AppError) {
      this._errorSrv.setError(error.toDto());
      this._loadingSrv.clearLoadings();
    } else {
      const cause = this.getStringFromAny(error);
      const err = new ErrorDto('Error, contacte con admins', ErrorType.Unknown, cause );
      this._errorSrv.setError(err);
      if (error.stack) {
        console.log(error.stack);
      }
      throw error;
    }
  }

  getStringFromAny(error: any): string {
    if (typeof error == 'string') {
      return error;
    } else if (typeof error.message == 'string') {
      return error.message;
    } else if (typeof error.cause == 'string') {
      return error.cause;
    } else {
      return 'Error desconocido';
    }
  }
}

import { ErrorHandler, Inject, inject, Injectable } from '@angular/core';
import { AppError, ErrorDto } from './AppError';
import { ErrorStateService } from './ErrorStateService';
import { commonsNames } from '../../..';
import { LoadingService } from '../../loadings/internals/LoadingService';
import { HttpErrorResponse } from '@angular/common/http';

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
    } else if (error instanceof HttpErrorResponse) {
      const casted = this._castServerError(error);
      const toShow = this._determineIfActionIsRequired(casted);
      this._errorSrv.setError(toShow);
    } else {
      this._printError(error);
      const cause = this.getStringFromAny(error);
      const err:ErrorDto = { message: 'Error, contacte con admins', typeArg: 400, cause: cause };
      this._errorSrv.setError(err);
      throw error;
    }
  }

  private _printError(error: any): void {
    if(!error.message && !error.stack) {
      const errSt = JSON.stringify(error);
      console.log(errSt);
      return ;
    }

    if (error.stack) {
      console.log(error.stack);
      return ;
    }

    if(error.message) {
      console.log(error.message);
    }

  }

  private _determineIfActionIsRequired(err: ErrorDto): ErrorDto {
    if (err.cause.includes('expired')) {
      return { message: 'Session caducada reinicie session', typeArg: 403, cause: 'Forbidden' };
    }
    return err;
  }

  private _castServerError(errorServerResp: HttpErrorResponse): ErrorDto {
    const error: ErrorDto = {
      message: 'Error desconocido',
      typeArg: 500,
      cause: 'Error desconocido',
    };
    if (errorServerResp.error) {
      if (typeof errorServerResp.error == 'string') {
        error.message = errorServerResp.error;
      } else if (errorServerResp.error.message) {
        error.message = errorServerResp.error.message;
      } else {
        error.message = 'Error desconocido';
      }
    }
    if (errorServerResp.status) {
      error.typeArg = errorServerResp.status;
    }
    if (typeof errorServerResp.error.cause === "string") {
      error.cause = errorServerResp.statusText;
    }
    return error;
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

import { ErrorHandler, inject, Injectable } from '@angular/core';
import { AppError } from '../externals/AppError';
import { ErrorStateService } from './ErrorStateService';
import { ErrorDto } from '../externals/ErrorDto';
import { ErrorType } from '../externals/ErrorType';

@Injectable({
  providedIn: 'root',
})
export class ErrorGlobalHandler implements ErrorHandler {
  private errorStateService = inject(ErrorStateService);

  handleError(error: any): void {
    if (error instanceof AppError) {
      this.errorStateService.setError(error.toDto());
      console.log(error.stack);
    } else {
      const cause: string = this.getStringFromAny(error);
      const err = new ErrorDto(
        'Error, contacte con admins',
        ErrorType.Unknown,
        cause
      );
      this.errorStateService.setError(err);
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

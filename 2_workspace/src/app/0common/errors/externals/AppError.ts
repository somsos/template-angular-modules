import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ErrorDto } from './ErrorDto';
import { ErrorType } from './ErrorType';

export class AppError extends Error {
  public readonly type: ErrorType | HttpStatusCode;

  constructor(
    msg: string,
    typeArg: ErrorType | HttpStatusCode = ErrorType.Unknown,
    cause: string = ''
  ) {
    super(msg);
    this.cause = cause;
    this.type = typeArg;
  }

  toDto(): ErrorDto {
    return new ErrorDto(this.message, this.type, JSON.stringify(this.cause));
  }

  static fromServer(err: HttpErrorResponse): AppError {
    // todo: err.error.causes
    const errorApp = new AppError(
      err.error.message,
      ErrorType.ServerSide,
      err.error.cause
    );
    return errorApp;
  }

}

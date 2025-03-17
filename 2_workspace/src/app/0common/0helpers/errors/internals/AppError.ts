import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';


// At the moment to serialize if we use a class that extends form Error, it has a weird behavior, so this es the why of this Dto
export interface ErrorDto {
  message: string;

  typeArg: HttpStatusCode;

  cause: string;
}


export class AppError extends Error {
  public readonly type: HttpStatusCode;

  constructor(
    msg: string,
    typeArg: HttpStatusCode | number = 400,
    cause: string = ''
  ) {
    super(msg);
    this.cause = cause;
    this.type = typeArg;
  }

  toDto(): ErrorDto {
    const err:ErrorDto = {message: this.message, typeArg: this.type, cause: JSON.stringify(this.cause)}
    return err;
  }

  static fromServer(err: HttpErrorResponse): AppError {
    // todo: err.error.causes
    const errorApp = new AppError(
      err.error.message,
      err.error.cause
    );
    return errorApp;
  }

}


import { HttpStatusCode } from '@angular/common/http';
import { ErrorType } from './ErrorType';

export interface ErrorDto {
  message: string;

  typeArg: ErrorType | HttpStatusCode;

  cause: string;
}

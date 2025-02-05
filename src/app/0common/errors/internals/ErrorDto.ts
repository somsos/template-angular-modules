import { HttpStatusCode } from '@angular/common/http';
import { ErrorType } from './ErrorType';

export class ErrorDto {
  constructor(
    public readonly message: string,
    public readonly typeArg: ErrorType | HttpStatusCode = ErrorType.Unknown,
    public readonly cause: string = ''
  ) {}
}

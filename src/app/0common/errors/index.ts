import { ErrorHandler } from '@angular/core';
import { ErrorGlobalHandler } from './internals/ErrorGlobalHandler';
import { ErrorStateService } from './internals/ErrorStateService';
export type { IErrorStateService } from './internals/IErrorStateService';
export { ErrorDto } from './internals/ErrorDto';
export { ErrorType } from './internals/ErrorType';

export const errorsHandlerProviders = [
  ErrorStateService,
  { provide: ErrorHandler, useClass: ErrorGlobalHandler },
];

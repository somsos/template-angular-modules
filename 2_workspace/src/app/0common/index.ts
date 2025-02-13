export { StringUtils } from './utils/StringUtils';

//error
export type { IErrorStateService } from './errors/externals/IErrorStateService';
export { AppError } from './errors/externals/AppError';
export { ErrorType } from './errors/externals/ErrorType';
export { ErrorDto } from './errors/externals/ErrorDto';

//loadings
export { RequestDto } from './loadings/externals/RequestDto';
export type { ILoadingService } from './loadings/externals/ILoadingService';

//others
export type { Endpoint } from './types/Endpoint';
export type { IAuthBackendService } from './auth/externals/IAuthBackendService';
export type { ILayoutService } from './layout/common/ILayoutService';

export const commonsNames = {
  IErrorStateService: 'IErrorStateService',
  ILoadingService: 'ILoadingService',
  ILayoutService: 'ILayoutService',
  IAuthBackendService: 'IAuthBackendService',
};

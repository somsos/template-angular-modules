

export { StringUtils } from './utils/StringUtils';

//types
export type { Entity } from './types/Entity';


//error
export type { IErrorStateService } from './errors/externals/IErrorStateService';
export { AppError } from './errors/externals/AppError';
export { ErrorType } from './errors/externals/ErrorType';
export type { ErrorDto } from './errors/externals/ErrorDto';

//loadings
export { RequestDto } from './loadings/externals/RequestDto';
export type { ILoadingService } from './loadings/externals/ILoadingService';

//others
export type { Endpoint } from './types/Endpoint';
export type { IAuthBackendService } from './auth/externals/IAuthBackendService';
export type { ILayoutService } from './layout/ILayoutService';

//auth
export { AuthDto } from './auth/externals/AuthDto';
export type { IRoleDto } from './auth/externals/IRoleDto';
export type { IAuthService } from './auth/externals/IAuthService';

//Paginator
export { PageUtils, PageHelper } from './paginator/PageRequest';
export type { IPagePayload, IPageResponse, IPaginatorService, } from './paginator/PageRequest';







export const commonsNames = {
  IErrorStateService: 'IErrorStateService',
  ILoadingService: 'ILoadingService',
  ILayoutService: 'ILayoutService',
  IAuthBackendService: 'IAuthBackendService',
};

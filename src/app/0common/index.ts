

export { StringUtils } from './utils/StringUtils';

//types
export type { Entity } from './types/Entity';


//error
export type { IErrorStateService, ErrorDto } from './0helpers/errors';
export { AppError } from './0helpers/errors';

//loadings
export { RequestDto } from './0helpers/loadings';
export type { ILoadingService } from './0helpers/loadings';

//others
export type { Endpoint } from './types/Endpoint';
export type { ILayoutService } from './layout/ILayoutService';
export { compareEndpoints, fromRequest } from './types/Endpoint';

//auth
export { AuthDto } from './auth/AuthDto';
export type { IRoleDto } from './auth/AuthDto';
export type { IAuthService } from './auth/IAuthService';
export type { IAuthApiRoutes } from './auth/IAuthApiRoutes';

//Paginator
export { PageHelper, PageUtils } from './0helpers/paginator';
export type { IPageResponse, IPagePayload, IPaginatorService } from './0helpers/paginator';




export const commonsNames = {
  IErrorStateService: 'IErrorStateService',
  ILoadingService: 'ILoadingService',
  ILayoutService: 'ILayoutService',
  IAuthApiRoutes: 'IAuthApiRoutes',
  IAuthService: 'IAuthService'
};

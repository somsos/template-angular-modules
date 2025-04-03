import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ErrorHandler, importProvidersFrom } from '@angular/core';
import { ErrorGlobalHandler, ErrorStateService } from './0helpers/errors';
import { LoadingService, LoadingsInterceptor } from './0helpers/loadings';
import { commonsNames } from '.';

//my modules
import { AuthApiRoutesImpl, AuthModule, JwtInterceptor } from '../auth';
import AuthService from '../auth/internals/domain/AuthService';
import { RoleUserGuard } from './auth/RoleUserGuard';



@NgModule({
  providers: [

    //errors
    { provide: ErrorHandler, useClass: ErrorGlobalHandler },
    { provide: commonsNames.IErrorStateService, useClass: ErrorStateService },
    // auth
    { provide: commonsNames.IAuthApiRoutes, useClass: AuthApiRoutesImpl },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //loadings
    { provide: commonsNames.ILoadingService, useClass: LoadingService },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingsInterceptor, multi: true },

    importProvidersFrom(AuthModule),

    RoleUserGuard,

  ],
})
export class CommonsModule {}

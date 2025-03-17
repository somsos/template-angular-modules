import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ErrorHandler, importProvidersFrom } from '@angular/core';
import { ErrorGlobalHandler, ErrorStateService } from './0helpers/errors';
import { LoadingService, LoadingsInterceptor } from './0helpers/loadings';
import { commonsNames } from '.';

//my modules
import { AuthApiRoutesImpl, AuthModule, JwtInterceptor } from '../auth';
import AuthService from '../auth/internals/domain/AuthService';



@NgModule({
  providers: [

    importProvidersFrom(AuthModule),

    //errors
    { provide: ErrorHandler, useClass: ErrorGlobalHandler },
    { provide: commonsNames.IErrorStateService, useClass: ErrorStateService },
    // auth
    { provide: commonsNames.IAuthApiRoutes, useClass: AuthApiRoutesImpl },
    { provide: commonsNames.IAuthService, useClass: AuthService },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //loadings
    { provide: commonsNames.ILoadingService, useClass: LoadingService },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingsInterceptor, multi: true },
  ],
})
export class CommonsModule {}

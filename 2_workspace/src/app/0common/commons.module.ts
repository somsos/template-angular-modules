import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { ErrorGlobalHandler } from './errors/internals/ErrorGlobalHandler';
import { ErrorStateService } from './errors/internals/ErrorStateService';
import { LoadingService } from './loadings/internals/LoadingService';
import { LoadingsInterceptor } from './loadings/internals/loadingsInterceptor';
import { LayoutService } from './layout';
import { JwtInterceptor } from './auth/internals/JwtInterceptor';
import { AuthBackendService } from './auth/internals/AuthBackendService';
import { commonsNames } from '.';

@NgModule({
  providers: [
    //errors
    { provide: ErrorHandler, useClass: ErrorGlobalHandler },
    { provide: commonsNames.IErrorStateService, useClass: ErrorStateService },
    // auth
    { provide: commonsNames.IAuthBackendService, useClass: AuthBackendService },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    //loadings
    { provide: commonsNames.ILoadingService, useClass: LoadingService },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingsInterceptor, multi: true },
    //layout
    { provide: commonsNames.ILayoutService, useClass: LayoutService },
  ],
})
export class CommonsModule {}

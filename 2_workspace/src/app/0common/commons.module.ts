import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { ErrorGlobalHandler } from './errors/internals/ErrorGlobalHandler';
import { ErrorStateService } from './errors/internals/ErrorStateService';
import { LoadingService } from './loadings/internals/LoadingService';
import { LoadingsInterceptor } from './loadings/internals/loadingsInterceptor';
import { LayoutService } from './layout';

export const commonsNames = {
  ErrorService: 'ErrorService',
  LoadingsService: 'LoadingsService',
  LayoutService: 'LayoutService',
};

@NgModule({
  providers: [
    //errors
    { provide: ErrorHandler, useClass: ErrorGlobalHandler },
    { provide: commonsNames.ErrorService, useClass: ErrorStateService },
    //loadings
    { provide: commonsNames.LoadingsService, useClass: LoadingService },
    { provide: HTTP_INTERCEPTORS, useClass: LoadingsInterceptor, multi: true },
    //layout
    { provide: commonsNames.LayoutService, useClass: LayoutService },
  ],
})
export class CommonsModule {}

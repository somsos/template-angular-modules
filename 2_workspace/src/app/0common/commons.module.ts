import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule, ErrorHandler } from '@angular/core';
import { ErrorGlobalHandler } from './errors/internals/ErrorGlobalHandler';
import { ErrorStateService } from './errors/internals/ErrorStateService';
import { LoadingService } from './loadings/internals/LoadingService';
import { LoadingsInterceptor } from './loadings/internals/loadingsInterceptor';
import { commonsNames } from '.';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { mainRoutes } from '../app.routing';
import { MainLayoutPage } from '../layout/view/pages/main-layout/main-layout.page';
import { LayoutModule } from '../layout/layout.module';
import { usersMockBackendInterceptor } from '../users/externals';
import { environment } from '../../environments/environment';

//my modules
import { AuthApiRoutesImpl, AuthModule, JwtInterceptor, mockAuthServer } from '../auth';
import AuthService from '../auth/internals/domain/AuthService';


console.log("environment", environment);


const mockInterceptors = (environment.backend.mock) ? [
  mockAuthServer,
] : [];

const allInterceptors = [
  ...mockInterceptors,
  usersMockBackendInterceptor,
]

@NgModule({
  bootstrap: [
    MainLayoutPage,
  ],
  imports: [
    LayoutModule,
  ],
  providers: [
    // Config
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(mainRoutes),
    importProvidersFrom(CommonsModule),
    importProvidersFrom(AuthModule),
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors(allInterceptors)
    ),
    provideAnimationsAsync('noop'),

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

import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { mainRoutes } from './app.routing';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { fakeAuthApiDao } from './auth';
import { loadingsInterceptor, loadingsProviders } from './0common/loadings';
import { errorsHandlerProviders } from './0common/errors';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(mainRoutes),
    ...errorsHandlerProviders,
    ...loadingsProviders,
    provideHttpClient(withInterceptors([loadingsInterceptor, fakeAuthApiDao])),
  ],
};

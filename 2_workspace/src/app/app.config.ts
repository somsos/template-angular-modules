import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { mainRoutes } from './app.routing';
import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { fakeAuthApiDao } from './auth';
import { productsMockBackend } from './products/data/mock/productsMockBackend.interceptor';
import { AuthModule } from './auth/auth.module';
import { CommonsModule } from './0common/commons.module';
import { MockUsersBackend } from './users/externals';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(mainRoutes),
    importProvidersFrom(CommonsModule),
    importProvidersFrom(AuthModule),
    MockUsersBackend,
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors([fakeAuthApiDao, productsMockBackend])
    ),
  ],
};

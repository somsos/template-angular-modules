
import { NgModule } from '@angular/core';
import { importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, withInterceptorsFromDi } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { mainRoutes } from '../app.routing';
import { MainLayoutPage, LayoutModule } from '.';
import { allMockInterceptors } from '../../mockBackend';
import { CommonsModule } from '../0common/commons.module';


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
    provideHttpClient(
      withInterceptorsFromDi(),
      withInterceptors(allMockInterceptors)
    ),
    provideAnimationsAsync('noop'),
  ],
})
export class MainModule {}

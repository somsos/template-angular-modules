import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse,
  HttpEventType,
  HTTP_INTERCEPTORS,
  HttpHandlerFn,
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, delay, Observable, tap, throwError } from 'rxjs';
import { LoadingService } from './LoadingService';

/*
export function loadingsInterceptor(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const _loadingService = inject(LoadingService);

  _loadingService.start(req.url);
  return next(req).pipe(
    delay(2000),
    tap((event: any) => {
      if (event.type === HttpEventType.Response) {
        _loadingService.setSuccess(req.url, req.body);
      }
    }),
    catchError((error: HttpErrorResponse) => {
      _loadingService.setFailed(req.url, error);
      return throwError(() => error);
    })
  );
}
*/

@Injectable()
export class LoadingsInterceptor implements HttpInterceptor {
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const _loadingService = inject(LoadingService);

    _loadingService.start(req.url);
    return next.handle(req).pipe(
      delay(2000),
      tap((event: any) => {
        if (event.type === HttpEventType.Response) {
          _loadingService.setSuccess(req.url, req.body);
        }
      }),
      catchError((error: HttpErrorResponse) => {
        _loadingService.setFailed(req.url, error);
        return throwError(() => error);
      })
    );
  }
}

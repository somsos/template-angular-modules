import {
  HttpRequest,
  HttpResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { delay, materialize, dematerialize } from 'rxjs/operators';
import { AppError, AuthDto } from '../../../../0common';

// array in local storage for registered users
const usersKey = 'authStore';
let allUsers: any[] = JSON.parse(localStorage.getItem(usersKey)!) || [];

export function mockAuthServer(
  req: HttpRequest<any>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> {
  const { url, method, headers, body } = req;

  createUsersIfNotExists();

  return handleRoute();

  function handleRoute() {
    switch (true) {
      case url.endsWith('/api/auth/login') && method === 'POST':
        return authenticate();
      default:
        // pass through any requests not handled above
        return next(req);
    }
  }

  // route functions

  function authenticate() {
    const { username, password } = body;

    const userFound = allUsers.find(
      (x) => x.username === username && x.password === password
    );

    if (!userFound) {
      return error('Username or password is incorrect');
    }

    return ok(userFound);
  }

  // helper functions

  function createUsersIfNotExists(): void {
    if (!localStorage.getItem(usersKey)) {
      const n1User = new AuthDto();
      n1User.id = 1;
      n1User.username = 'mario1';
      n1User.password = 'mario1p';
      n1User.token = 'fake-token';
      n1User.roles = [{id: 1, authority: 'admin_users'}, {id: 2, authority: 'admin_products'}];
      allUsers.push(n1User);
      localStorage.setItem(usersKey, JSON.stringify(allUsers));
    }
  }

  function ok(body?: any) {
    return of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
  }

  function error(message: string) {
    const error = new AppError(message, HttpStatusCode.Forbidden);
    return throwError(() => error).pipe(
      materialize(),
      delay(500),
      dematerialize()
    ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
  }

  function unauthorized() {
    const error = new AppError('Unauthorized', HttpStatusCode.Forbidden);
    return throwError(() => error).pipe(
      materialize(),
      delay(500),
      dematerialize()
    );
  }

  function basicDetails(user: any) {
    const { id, username, firstName, lastName } = user;
    return { id, username, firstName, lastName };
  }

  function isLoggedIn() {
    return headers.get('Authorization') === 'Bearer fake-jwt-token';
  }

  function idFromUrl() {
    const urlParts = url.split('/');
    return parseInt(urlParts[urlParts.length - 1]);
  }
}

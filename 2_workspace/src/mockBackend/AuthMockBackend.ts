import { HttpRequest, HttpEvent, HttpHandlerFn, } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsersMockBackend } from './UsersMockBackend';
import { MockUsersBackendUtils } from '../app/0common/utils/MockBackendUtils';
import AuthApiDao from '../app/auth/internals/data/AuthApiDao';

const usersBD = new UsersMockBackend();

export function AuthMockBackend(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const { url, method, headers, body } = req;

  return handleRoute();

  function handleRoute() {
    switch (true) {
      case url.endsWith(AuthApiDao.loginPath) && method === 'POST':
        return authenticate();
      default:
        // pass through any requests not handled above
        return next(req);
    }
  }

  // route functions

  function authenticate() {
    const { username, password } = body;
    const allUsers = usersBD.getAllUsers();
    const userFound = allUsers.find(
      (x) => x.username === username && x.password === password
    );

    if (!userFound) {
      return MockUsersBackendUtils.error('Username or password is incorrect');
    }

    return MockUsersBackendUtils.ok(userFound);
  }

  // helper functions


}

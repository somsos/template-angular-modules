import { Observable } from 'rxjs';
import { AuthDto } from './AuthDto';

export const IAuthServiceName = 'IAuthServiceName';

export interface IAuthService {

  observeUserLogged(): Observable<AuthDto | undefined>;

  getUserAuth(): AuthDto | undefined;

  // is used in main layout
  logout(): void;
}

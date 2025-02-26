import { Observable } from 'rxjs';
import { AuthDto } from './AuthDto';

export const IAuthServiceName = 'IAuthServiceName';

export interface IAuthService {
  getUserLogged(): Observable<AuthDto | undefined>;

  // is used in main layout
  logout(): void;
}

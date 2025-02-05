import { Observable } from 'rxjs';
import AuthDto from './AuthDto';

export const IAuthServiceName = 'IAuthServiceName';

export default interface IAuthService {
  getUserLogged(): Observable<AuthDto | undefined>;
}

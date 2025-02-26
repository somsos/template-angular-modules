import { IAuthServiceName } from '../0common/auth/externals/IAuthService';
import AuthService from './domain/AuthService';

export * from '../0common/auth/externals/AuthDto';

export { fakeAuthApiDao } from './data/FakeAuthApiDao';

export const authNames = {
  AuthService: IAuthServiceName,
};

export const authProviders = [
  { provide: authNames.AuthService, useClass: AuthService },
];

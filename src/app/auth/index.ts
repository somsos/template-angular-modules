import { IAuthServiceName } from './common/IAuthService';
import AuthService from './domain/AuthService';

export * from './common/AuthDto';

export { fakeAuthApiDao } from './data/FakeAuthApiDao';

export const authNames = {
  AuthService: IAuthServiceName,
};

export const authProviders = [
  { provide: authNames.AuthService, useClass: AuthService },
];

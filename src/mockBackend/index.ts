
import { environment } from "../environments/environment";
import { AuthMockBackend } from "./AuthMockBackend";
import { UsersMockBackendInterceptor } from "./UsersMockBackend";

const removableMockInterceptors = (environment.backend.mock) ? [
  AuthMockBackend,
  UsersMockBackendInterceptor,
] : [];

export const allMockInterceptors = [
  ...removableMockInterceptors,
]

import { AppError, ErrorType } from "../..";

export class AuthDto {
  id?: number;
  username?: string;
  password?: string;
  token?: string;
  roles?: string[];

  static fromAny(arg0: unknown): AuthDto {
    let cause = AuthDto.hasSomeError(arg0);
    if (cause) {
      throw new AppError('Usuario no valido', ErrorType.CodeFault, cause);
    }
    const casted = arg0 as AuthDto;
    return casted;
  }

  static hasSomeError(arg0: any): string | undefined {
    if (typeof arg0 !== 'object') {
      return 'tipo de usuario incorrecto';
    }

    if (typeof arg0.id !== 'number' && arg0.id !== 0) {
      return 'usuario id incorrecto';
    }

    if (typeof arg0.username !== 'string' && arg0.username !== '') {
      return 'username incorrecto';
    }

    if (typeof arg0.token !== 'string' && arg0.token !== '') {
      return 'token incorrecto';
    }

    if (arg0.roles instanceof Array == false) {
      return 'roles incorrectos';
    }

    return undefined;
  }
}

/*
export type AuthViewModel = Pick<AuthDto, | 'id' | 'username' | 'roles'>;
const myDto = new AuthDto();
const myView: AuthViewModel = myDto;
console.log(myView.password); // <-- Error
*/

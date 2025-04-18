import { AppError, Entity } from "..";

export class AuthDto implements Entity {
  id: number = -1;
  username?: string;
  email?: string;
  password?: string;
  token?: string;
  roles: Partial<IRoleDto>[] = [];

  active?: boolean;

  createdAt?: Date;

  updatedAt?: Date;

  static hasRoles(uToCheck: AuthDto | undefined, acceptedRoles: string[]): boolean {
    if(!uToCheck) {
      return false;
    }

    for (let i = 0; i < uToCheck.roles.length; i++) {
      const userRole = uToCheck.roles[i];
      for (let iAR = 0; iAR < acceptedRoles.length; iAR++) {
        const acceptedRole = acceptedRoles[iAR];
        if(userRole.authority?.includes(acceptedRole)) {
          return true;
        }
      }
    }
    return false;
  }

  static fromAny(arg0: unknown): AuthDto {
    let cause = AuthDto.hasSomeError(arg0);
    if (cause) {
      throw new AppError('Usuario no valido', 600, cause);
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

export interface IRoleDto {

  id: number;

  authority: string;

}


/*
export type AuthViewModel = Pick<AuthDto, | 'id' | 'username' | 'roles'>;
const myDto = new AuthDto();
const myView: AuthViewModel = myDto;
console.log(myView.password); // <-- Error
*/

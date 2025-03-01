import { Entity } from "../../../0common";
import { IUserRoleDto } from "./IUserRoleDto";

export interface IUserDto extends Entity {

  id: number;

  name: string;

  lastName: string;

  pictureId: number;

  pictureFile: File | null;

  // sync with 0common/auth/externals/AuthDto.ts
  // read architecture_manifest.md -> Keep the modules independent as posible
  username: string;
  password: string;
  roles: IUserRoleDto[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // end sync

}

export function emptyUser(): IUserDto {
  return {
    id: 0,
    name: '',
    lastName: '',
    pictureId: 0,
    pictureFile: null,
    username: "",
    password: "",
    roles: [],
    active: false,
  };
}

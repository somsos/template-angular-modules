import { Entity } from "../../../0common";
import { IUserRoleDto } from "./IUserRoleDto";

export interface IUserDto extends Entity {

  id: number;

  pictureId: number;

  pictureFile?: File | null;

  // sync with 0common/auth/externals/AuthDto.ts
  // read architecture_manifest.md -> Keep the modules independent as posible
  username: string;
  password: string;
  token?: string;
  roles: IUserRoleDto[];
  active: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  // end sync

}



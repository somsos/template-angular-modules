import { Entity } from "../../../0common/types/Entity";

export interface IUserDto extends Entity {

  id: number;

  name: string;

  lastName: string;

  pictureId: number;

  pictureFile: File | null;

  active: boolean;

  createdAt: Date;

  updatedAt?: Date;

}

export function emptyUser(): IUserDto {
  return {
    id: 0,
    name: '',
    lastName: '',
    pictureId: 0,
    pictureFile: null,
    active: false,
    createdAt: new Date(),
  };
}

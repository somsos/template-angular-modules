import { Entity } from "../../../0common/types/Entity";

export interface IUserDto extends Entity {

  id: number;

  name: string;

  lastName: string;

  pictureId: number;

  active: boolean;

  createdAt: Date;

  updatedAt?: Date;

}

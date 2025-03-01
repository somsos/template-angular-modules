import { IUserDto } from "./IUserDto";
import { IUserRoleDto } from "./IUserRoleDto";

type IUserAdd = Pick<IUserDto, "name" | "lastName" | "active" | "roles">;

export class UserAdd implements IUserAdd {
  constructor(
    public name: string,
    public lastName: string,
    public active: boolean = true,
    public picture: File | null = null,
    public roles: IUserRoleDto[]
  ) {}

  static fromDto(dto: IUserDto): UserAdd {
    const casted = new UserAdd(dto.name, dto.lastName, dto.active, dto.pictureFile, dto.roles);
    return casted;
  }

}

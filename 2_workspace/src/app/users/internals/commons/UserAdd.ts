import { IUserDto } from "./IUserDto";

type IUserAdd = Pick<IUserDto, "name" | "lastName" | "active">;

export class UserAdd implements IUserAdd {
  constructor(
    public name: string,
    public lastName: string,
    public active: boolean = true,
    public picture: File | null = null
  ) {}

  static fromDto(dto: IUserDto): UserAdd {
    return new UserAdd(dto.name, dto.lastName, dto.active, dto.pictureFile);
  }

}

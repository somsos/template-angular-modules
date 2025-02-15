import { IUserDto } from "./IUserDto";

type IUserAdd = Pick<IUserDto, "name" | "lastName" | "active">;

export class UserAdd implements IUserAdd {
  constructor(
    public name: string,
    public lastName: string,
    public active: boolean = true,
    public picture: File | null = null
  ) {}
}

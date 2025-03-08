import { IUserDto } from "./IUserDto";

export type IUserAdd = Pick<IUserDto, "username" | "active" | "roles" | "pictureFile">;

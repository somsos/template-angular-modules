import { IUserDto } from "./IUserDto";

export type IUserAdd = Pick<IUserDto, "username" | "email" | "password" | "roles" | "pictureFile">;

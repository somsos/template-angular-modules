import { IUserDto } from "./IUserDto";
import { IUserRoleDto } from "./IUserRoleDto";
import { IUserAdd } from "./UserAdd";


export abstract class UserDtoUtils {

  public static buildEmptyUser(): IUserDto {
    return {
      id: 0,
      pictureId: 0,
      pictureFile: null,
      username: "",
      password: "",
      roles: [],
      active: false,
    };
  }


  public static fromDto(dto: IUserDto): IUserAdd {
    const casted: IUserAdd = {
      username: dto.username,
      active: dto.active,
      pictureFile: dto.pictureFile,
      roles: dto.roles
    };
    return casted;
  }

  /*
  public static dtoToIUserItem(u: IUserDto): IUserItem {
    return {
      ...u,
      visible: true,
      rolesList: UserDtoUtils.buildRolesToShow(u.roles),
      createdAt: UserDtoUtils.buildDateToShow(u.createdAt),
      updatedAt: UserDtoUtils.buildDateToShow(u.updatedAt),
    } as IUserItem;
  }
  */

  public static buildRolesToShow(roles: IUserRoleDto[]): string {
    const invalid = (roles === undefined || roles.length <= 0);

    if(invalid) {
      return "Ninguno"
    }
    const rl = roles.map(r => r.authority).toString();
    return rl;
  }


  static buildDateToShow(d: Date | undefined): string {
    if(!d) {
      return "Sin registro"
    }
    return d.getFullYear() + "/" +
      d.getMonth() + 1 + "/"  +
      d.getDay() ;
  }

}

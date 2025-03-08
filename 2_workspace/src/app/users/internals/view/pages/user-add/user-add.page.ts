import { Component, inject } from '@angular/core';
import { UsersService } from '../../../domain/UsersService';
import { IUserDto } from '../../../commons/IUserDto';
import { UserUIHelper } from '../../helpers/UserUIHelper';
import { AppError } from '../../../../../0common';
import { HttpErrorResponse } from '@angular/common/http';
import { UserDtoUtils } from '../../../commons/UserDtoUtils';

@Component({
  selector: 'user-add-page',
  templateUrl: './user-add.page.html',
  styleUrl: './user-add.page.scss'
})
export class UserAddPage {

  private readonly usersSrv = inject(UsersService);

  private readonly _uiHelper = inject(UserUIHelper);

  userToAdd: IUserDto = UserDtoUtils.buildEmptyUser();

  onUserSubmit(userForm: IUserDto): void {
    const toAdd = UserDtoUtils.fromDto(userForm);
    this.usersSrv.save(toAdd).subscribe({
      complete: () => {
        this._uiHelper.goToUsers();
      },
      error: (err) => {
        if(err instanceof HttpErrorResponse && err.url?.includes("pictures")) {
          this._uiHelper.goToUsers();
          throw new AppError("Error al subir imagen: intente después");
        }
        throw new AppError("Error al guardar usuario");
      },
    });
  }

}

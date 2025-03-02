import { Component, inject } from '@angular/core';
import { UserAdd } from '../../../commons/UserAdd';
import { UsersService } from '../../../domain/UsersService';
import { emptyUser, IUserDto } from '../../../commons/IUserDto';
import { UserUIHelper } from '../../helpers/UserUIHelper';
import { AppError } from '../../../../../0common';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'user-add-page',
  templateUrl: './user-add.page.html',
  styleUrl: './user-add.page.scss'
})
export class UserAddPage {

  private readonly usersSrv = inject(UsersService);

  private readonly _uiHelper = inject(UserUIHelper);

  userToAdd: IUserDto = emptyUser();

  onUserSubmit(userForm: IUserDto): void {
    const toAdd = UserAdd.fromDto(userForm);
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

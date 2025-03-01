import { Component, inject } from '@angular/core';
import { UserAdd } from '../../../commons/UserAdd';
import { UsersService } from '../../../domain/UsersService';
import { emptyUser, IUserDto } from '../../../commons/IUserDto';
import { UserUIHelper } from '../../helpers/UserUIHelper';

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
    this.usersSrv.save(toAdd).subscribe({complete: () => {
      this._uiHelper.goToUsers();
    }});
  }

}

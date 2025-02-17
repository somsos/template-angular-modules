import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs';
import { IUserDto } from '../../../commons/IUserDto';
import { UsersService } from '../../../domain/UsersService';
import { UserUIHelper } from '../../helpers/UserUIHelper';

@Component({
  selector: 'user-update-page',
  templateUrl: './user-update.page.html',
  styleUrl: './user-update.page.scss'
})
export class UserUpdatePage {
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _uiHelper = inject(UserUIHelper);
  private readonly _srv = inject(UsersService);

  public readonly found$ = this._uiHelper.findUserByIdParam(this._activatedRoute);


  onUserSubmit(newInfo: IUserDto) {
    this._srv.update(newInfo).pipe(first()).subscribe({
      complete: () => {
          this._uiHelper.goToUsers();
      },
    })
  }


}

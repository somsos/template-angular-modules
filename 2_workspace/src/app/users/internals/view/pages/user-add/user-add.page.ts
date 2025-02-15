import { Component, inject } from '@angular/core';
import { UserAdd } from '../../../commons/UserAdd';
import { UsersService } from '../../../domain/UsersService';
import { Router } from '@angular/router';

@Component({
  selector: 'user-add-page',
  templateUrl: './user-add.page.html',
  styleUrl: './user-add.page.scss'
})
export class UserAddPage {

  private readonly usersSrv = inject(UsersService);
  private readonly _router = inject(Router);

  userToAdd = new UserAdd("", "");

  onUserChanged($event: UserAdd) {
    this.usersSrv.save($event).subscribe({complete: () => {
      this._goToUsers();
    }});
  }

  private _goToUsers() {
    this._router.navigate(['/users']);
  }

}

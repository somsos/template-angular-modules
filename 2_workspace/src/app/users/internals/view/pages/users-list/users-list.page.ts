import { Component, inject } from '@angular/core';
import { UsersService } from '../../../domain/UsersService';

@Component({
  selector: 'users-list-page',
  templateUrl: './users-list.page.html',
  styleUrl: './users-list.page.scss'
})
export class UsersListPage {

  private readonly _srv = inject(UsersService);

  public users$ = this._srv.getAll();

}

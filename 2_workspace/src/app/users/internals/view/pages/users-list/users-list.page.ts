import { Component, Inject, inject } from '@angular/core';
import { UsersService } from '../../../domain/UsersService';
import { commonsNames, ILayoutService } from '../../../../../0common';
import { retry, tap } from 'rxjs';
import { UsersImagesStore } from '../../../data/mock/UsersImagesStore';

@Component({
  selector: 'users-list-page',
  templateUrl: './users-list.page.html',
  styleUrl: './users-list.page.scss'
})
export class UsersListPage {

  private readonly _srv = inject(UsersService);

  public users$ = this._srv.getAll().pipe(tap((list) => console.log("list", list)));

  public idUserToShow = -1;

  constructor(
    @Inject(commonsNames.ILayoutService) private _layoutSrv: ILayoutService
  ) {}


  deleteById(id: number) {
    const msg = '¿Realmente quieres eliminar este usuario?';
    const sub = this._layoutSrv.askConfirmation(msg).subscribe((confirm) => {
      if (confirm) {
        const sub2 = this._srv.deleteById(id).subscribe({
          complete: () => {
            this.users$ = this.users$.pipe(retry());
            sub2.unsubscribe();
          },
        });
      }
      sub.unsubscribe();
    });
  }

  getBase64UrlByUserId(id: number): string {
    return UsersImagesStore.getUrlByUser(id);
  }

  toggleDetails(arg0: number) {
    if(this.idUserToShow == arg0) {
      this.idUserToShow = -1;
    } else {
      this.idUserToShow = arg0;
    }
  }

}

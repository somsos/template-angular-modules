import {
  Component,
  Inject,
  OnInit,
} from '@angular/core';
import {} from '@angular/core';
import { tap } from 'rxjs';
import { commonsNames, ILayoutService } from '../../../../0common';

@Component({
  selector: 'dialog-confirmation',
  templateUrl: './dialog-confirmation.component.html',
  styleUrl: './dialog-confirmation.component.scss',
})
export class DialogConfirmationComponent implements OnInit {
  private _dialogRef: any;
  public msg = '';

  constructor(
      @Inject(commonsNames.ILayoutService) private _layoutSrv: ILayoutService
  ) {}

  ngOnInit() {
    this._dialogRef = document.getElementById('dialog-element');
    this._observeIfUserWantsToShowConfirmation();
  }

  private _observeIfUserWantsToShowConfirmation(): void {
    this._dialogRef.close();
    this._layoutSrv
      .showConfirmation()
      .pipe(
        tap((msg) => {
          if (msg) {
            this._dialogRef.showModal();
            this.msg = msg;
          } else {
            this._dialogRef.close();
          }
        })
      )
      .subscribe();
  }

  onClickClose() {
    this._layoutSrv.confirm(false);
    this._dialogRef.close();
  }

  onClickConfirm() {
    this._layoutSrv.confirm(true);
    this._dialogRef.close();
  }
}

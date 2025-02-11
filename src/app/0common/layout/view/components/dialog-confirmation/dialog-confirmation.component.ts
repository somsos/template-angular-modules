import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import {} from '@angular/core';
import { LayoutService } from '../../../domain/LayoutService';
import { ILayoutService } from '../../../common/ILayoutService';
import { tap } from 'rxjs';

@Component({
  selector: 'dialog-confirmation',
  standalone: true,
  templateUrl: './dialog-confirmation.component.html',
  styleUrl: './dialog-confirmation.component.scss',
})
export class DialogConfirmationComponent implements OnInit {
  private _dialogRef: any;
  private _dialogSrv: ILayoutService = inject(LayoutService);
  public msg = '';

  ngOnInit() {
    this._dialogRef = document.getElementById('dialog-element');
    this._observeIfUserWantsToShowConfirmation();
  }

  private _observeIfUserWantsToShowConfirmation(): void {
    this._dialogRef.close();
    this._dialogSrv
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
    this._dialogSrv.confirm(false);
    this._dialogRef.close();
  }

  onClickConfirm() {
    this._dialogSrv.confirm(true);
    this._dialogRef.close();
  }
}

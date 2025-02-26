import { first, map, Observable, Subject, switchMap } from 'rxjs';
import { ILayoutService } from '../../0common/layout/ILayoutService';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LayoutService implements ILayoutService {
  private _confirmation$: Subject<boolean> | null = null;
  private _show$ = new Subject<string | null>();

  askConfirmation(msg: string): Observable<boolean> {
    this._confirmation$ = new Subject<boolean>();
    this._show$.next(msg);
    return this._confirmation$.pipe(first());
  }

  showConfirmation(): Observable<string | null> {
    return this._show$;
  }

  confirm(v: boolean): void {
    this._show$.next(null);
    this._confirmation$?.next(v);
    this._confirmation$?.complete();
    this._confirmation$ = null;
  }
}

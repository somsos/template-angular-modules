import { Observable } from 'rxjs';

export interface ILayoutService {
  askConfirmation(msg: string): Observable<boolean>;

  showConfirmation(): Observable<string | null>;

  confirm(arg0: boolean): void;

  showError(error: any): void;

}

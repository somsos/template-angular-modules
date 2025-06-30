import { Observable } from 'rxjs';
import { ErrorDto } from '../0helpers/errors';

export interface ILayoutService {
  askConfirmation(msg: string): Observable<boolean>;

  showConfirmation(): Observable<string | null>;

  confirm(arg0: boolean): void;

  showError(error: ErrorDto): void;

}

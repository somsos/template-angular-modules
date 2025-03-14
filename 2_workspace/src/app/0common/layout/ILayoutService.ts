import { Observable } from 'rxjs';
import { ErrorDto } from '../errors/externals/ErrorDto';

export interface ILayoutService {
  askConfirmation(msg: string): Observable<boolean>;

  showConfirmation(): Observable<string | null>;

  confirm(arg0: boolean): void;

  showError(error: ErrorDto): void;

}

import { Observable } from 'rxjs';
import { ErrorDto } from './ErrorDto';

export interface IErrorStateService {
  getError(): Observable<ErrorDto | undefined>;

  setError(error: ErrorDto): void
}

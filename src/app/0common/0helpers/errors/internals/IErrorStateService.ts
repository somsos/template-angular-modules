import { Observable } from 'rxjs';
import { ErrorDto } from './AppError';

export interface IErrorStateService {
  getError(): Observable<ErrorDto | undefined>;

  setError(error: ErrorDto): void
}

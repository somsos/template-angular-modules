import { Observable } from 'rxjs';
import { RequestDto } from './RequestDto';

export interface ILoadingService {
  getRequest(): Observable<RequestDto>;
}

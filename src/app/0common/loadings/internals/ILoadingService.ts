import { Observable } from 'rxjs';
import { RequestDto } from './RequestDto';

export const ILoadingServiceName = 'ILoadingService';

export interface ILoadingService {
  getRequest(): Observable<RequestDto>;
}

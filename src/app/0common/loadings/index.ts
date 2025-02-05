import { ILoadingServiceName } from './internals/ILoadingService';
import { LoadingService } from './internals/LoadingService';

//------------

export { loadingsInterceptor } from './internals/loadingsInterceptor';

export type { ILoadingService } from './internals/ILoadingService';
export { RequestDto } from './internals/RequestDto';

export const loadingsNames = {
  service: ILoadingServiceName,
};

export const loadingsProviders = [
  { provide: loadingsNames.service, useClass: LoadingService },
];

import { HttpRequest } from '@angular/common/http';
import { StringUtils } from '../utils/StringUtils';
import { AppError } from '..';

export interface Endpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  url: string;
  auth: boolean
}

export function fromRequest(req: HttpRequest<unknown>): Endpoint {
  if ( req.method != 'GET' && req.method != 'POST' && req.method != 'PUT' && req.method != 'DELETE' ) {
    throw new AppError('Method is not correct: ' + req.method);
  }

  const cast: Endpoint = {
    method: req.method,
    url: req.url,
    auth: determineIfIsAuthRequired(req.method),
  };

  return cast;
}

function determineIfIsAuthRequired(method: string) {
  if ( method == 'POST' || method == 'PUT' || method == 'DELETE' ) {
    return true;
  }
  return false;
}

export function compareEndpoints(request: Endpoint, route: Endpoint): boolean {
  if (request.method !== route.method) {
    return false;
  }

  if (!StringUtils.compareUrls(route.url, request.url)) {
    return false;
  }

  return true;
}


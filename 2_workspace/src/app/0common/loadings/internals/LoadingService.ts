import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestDto } from '../externals/RequestDto';
import { Observable, Subject } from 'rxjs';
import { ILoadingService } from '../externals/ILoadingService';

@Injectable({
  providedIn: 'root',
})
export class LoadingService implements ILoadingService {
  private _currentRequest = new RequestDto();
  private _loadings = new Subject<RequestDto>();

  public instance: number;

  constructor() {
    this.instance = Math.floor(Math.random() * 100 + 1);
  }

  // for external modules
  public getRequest(): Observable<RequestDto> {
    return this._loadings;
  }

  //for module internals

  start(url: string): void {
    this._currentRequest.url = url;
    this._currentRequest.status = 'loading';
    this._loadings.next(this._currentRequest);
  }

  setSuccess(url: string, body: unknown): void {
    this._currentRequest.url = url;
    this._currentRequest.status = 'success';
    this._currentRequest.response = body;
    this._loadings.next(this._currentRequest);
  }

  setFailed(url: string, error: HttpErrorResponse): void {
    this._currentRequest.url = url;
    this._currentRequest.status = 'failed';
    this._currentRequest.error = error;
    this._loadings.next(this._currentRequest);
  }
}

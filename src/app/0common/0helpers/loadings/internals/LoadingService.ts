import { HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RequestDto } from './RequestDto';
import { Observable, Subject } from 'rxjs';
import { ILoadingService } from './ILoadingService';

@Injectable({
  providedIn: 'root',
})
export class LoadingService implements ILoadingService {
  private _currentRequest = new RequestDto();
  private _loadings = new Subject<RequestDto>();

  public getRequest(): Observable<RequestDto> {
    return this._loadings;
  }

  start(url: string): void {
    console.log("started", url);
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

  clearLoadings() {
    this._currentRequest.status = 'failed';
    this._loadings.next(this._currentRequest);
  }

}

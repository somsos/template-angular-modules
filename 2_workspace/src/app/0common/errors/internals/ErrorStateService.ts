import { Injectable } from '@angular/core';
import { IErrorStateService } from '../IErrorStateService';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { ErrorDto } from '../ErrorDto';

@Injectable({
  providedIn: 'root',
})
export class ErrorStateService implements IErrorStateService {
  private readonly error = new BehaviorSubject<ErrorDto | undefined>(undefined);

  getError(): Observable<ErrorDto | undefined> {
    return this.error;
  }

  setError(error: ErrorDto | undefined) {
    this.error.next(error);
    const t = setTimeout(() => {
      this.error.next(undefined);
      clearTimeout(t);
    }, 4000);
  }
}

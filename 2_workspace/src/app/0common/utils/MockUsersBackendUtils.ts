import { HttpEvent, HttpHeaders, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { Observable, of, delay, throwError, materialize, dematerialize } from "rxjs";
import { AppError } from "../errors/externals/AppError";
import { StringUtils } from "./StringUtils";
import { Entity } from "../types/Entity";

export abstract class MockUsersBackendUtils {

  static ok(body?: any): Observable<HttpResponse<any>> {
    const resp = of(new HttpResponse({ status: 200, body })).pipe(delay(500)); // delay observable to simulate server api call
    return resp;
  }

  static error(message: string): Observable<never> {
    const error = new AppError(message, HttpStatusCode.Forbidden);
    const errorResponse = throwError(() => error).pipe(
      materialize(),
      delay(1000),
      dematerialize()
    ); // call materialize and dematerialize to ensure delay even if an error is thrown (https://github.com/Reactive-Extensions/RxJS/issues/648);
    return errorResponse;
  }

  static unauthorized(): Observable<never> {
    const error = new AppError('Unauthorized', HttpStatusCode.Forbidden);
    return throwError(() => error).pipe(
      materialize(),
      delay(2000),
      dematerialize()
    );
  }

  static getPathId(url:string): number {
    const pathId = url.substring(url.lastIndexOf('/') + 1, url.length);
    const id = StringUtils.toNumber(pathId);
    return id;
  }

  static getBiggestId(all: Array<Entity>): number {
    const ids = all.map((p) => p.id);
    const higherId = Math.max.apply(Math, ids);
    return higherId;
  }

  static addEntity(storeName: string, toAdd: Entity, all: Array<Entity>) {
    toAdd.id = MockUsersBackendUtils.getBiggestId(all) + 1;
    all.unshift(toAdd);
    const newStore = JSON.stringify(all);
    localStorage.setItem(storeName, newStore);
  }

  static mustBeAuthenticatedOrThrow(headers: HttpHeaders): void {
    const jwt = headers.get("Authorization");
    if (!jwt) {
      throw new AppError('Unauthorized', HttpStatusCode.Forbidden);
    }
  }

  static castError(error: unknown): Observable<never> {
    if (error instanceof AppError) {
      if(error.message === 'Unauthorized') {
        return MockUsersBackendUtils.unauthorized();
      }
      return MockUsersBackendUtils.error(error.message)
    }

    if (error instanceof Error) {
      return MockUsersBackendUtils.error(error.message)
    }

    if (typeof error === 'string') {
      return MockUsersBackendUtils.error(error)
    }
    return MockUsersBackendUtils.error('Error desconocido');
  }

  static deleteById(keyStoreU: string, id: number, allE: Entity[]): Entity {
    const index = allE.findIndex((p) => p.id === id);
    const toDelete = allE[index];
    allE.splice(index, 1);
    const newStore = JSON.stringify(allE);
    localStorage.setItem(keyStoreU, newStore);
    return toDelete;
  }

}


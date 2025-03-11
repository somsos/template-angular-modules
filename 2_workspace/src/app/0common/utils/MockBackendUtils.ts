import { HttpEvent, HttpHeaders, HttpResponse, HttpStatusCode } from "@angular/common/http";
import { Observable, of, delay, throwError, materialize, dematerialize } from "rxjs";
import { AppError } from "../errors/externals/AppError";
import { StringUtils } from "./StringUtils";
import { Entity } from "../types/Entity";
import { IPagePayload, IPageResponse } from "../paginator/PageRequest";

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

  static getUrlParams(url: string): Map<string, string> {
    let paramString = url.split('?')[1];
    const searchParam = new URLSearchParams(paramString);
    const params = new Map<string, string>();
    for (let pair of searchParam.entries()) {
      params.set(pair[0], pair[1]);
    }
    return params;
  }

  static getBiggestId(all: Array<Entity>): number {
    const ids = all.map((p) => p.id);
    if(ids.length == 0) {
      return 1;
    }
    const higherId = Math.max.apply(Math, ids);
    return higherId;
  }

  static addEntity(storeName: string, toAdd: Entity, all: Array<Entity>) {
    toAdd.id = MockUsersBackendUtils.getBiggestId(all) + 1;
    all.unshift(toAdd);
    const newStore = JSON.stringify(all);
    localStorage.setItem(storeName, newStore);
  }

  static updateEntity(storeName: string, newInfo: Entity, all: Array<Entity>): Entity {
    const index = all.findIndex((p) => p.id === newInfo.id);
    const oldInfo = all[index];
    if(!oldInfo) {
      throw new AppError('Id no encontrado', HttpStatusCode.NotFound);
    }
    all[index] = newInfo;
    const newStore = JSON.stringify(all);
    localStorage.setItem(storeName, newStore);
    return oldInfo;
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

  static notFoundError(msg: string): Observable<HttpEvent<any>> {
    const error = new AppError(msg, HttpStatusCode.NotFound);
    return throwError(() => error).pipe(
      materialize(),
      delay(2000),
      dematerialize()
    );
  }

  // AI generated
  static buildPage(all: Entity[], payload: IPagePayload): IPageResponse<Entity> {
    // Sort the data based on the sort property and direction
    const prop = payload.sort.property;
    const sortedData = all.sort((a: any, b: any) => {
      if(typeof a[prop] == 'string') {
        const aLowCase = a[prop].toLocaleLowerCase();
        const bLowCase = b[prop].toLocaleLowerCase();
        if (payload.sort.direction === 'asc') {
          return aLowCase.localeCompare(bLowCase);
        } else {
          return bLowCase.localeCompare(aLowCase);
        }
      }
      else if (typeof a[prop] == 'number') {
        if (payload.sort.direction === 'asc') {
          return a[prop] - b[prop];
        } else {
          return b[prop] - a[prop];
        }
      } else if(a[prop] instanceof Date) {
        const aTime = new Date(a[prop]).getTime();
        const bTime = new Date(b[prop]).getTime();
        if (payload.sort.direction === 'asc') {
          return aTime - bTime;
        } else {
          return bTime - aTime;
        }
      } else if(a[prop] instanceof Array) {
      const aL = a[prop].length;
      const bL = b[prop].length;
      if (payload.sort.direction === 'asc') {
        return aL - bL;
      } else {
        return bL - aL;
      }
    }

    });

    // Calculate pagination
    const startIndex = payload.page.index * payload.page.itemsPerPage;
    // if overload return last page even if is not correct, and set flag indicating is the last one
    let endIndex = startIndex + payload.page.itemsPerPage;
    if(endIndex >= all.length) {
      endIndex = all.length;
    }
    const paginatedData = sortedData.slice(startIndex, endIndex);
    return {
      itemsInTotal: all.length,
      data: paginatedData,
    };
  }

  // AI generated
  static overallFilter<T>(all: T[], querySt: string, filterOn: string[]): T[] {
    const filtered = all.filter((item) => {
      // Check if any of the properties in the filterOn array match the query string
      return filterOn.some((key) => {
        const value = item[key as keyof T];

        // If the value is a string, we check if the query string exists in the value
        if (typeof value === 'string') {
          return value.toLowerCase().includes(querySt.toLowerCase());
        }

        // If the value is a Date, we convert it to string and check the query string
        if (value instanceof Date) {
          const stDate = value.toISOString().toLowerCase();
          return stDate.includes(querySt.toLowerCase());
        }

        // If the value is an array (e.g., roles), we check if any element matches
        if (Array.isArray(value)) {
          return value.some((el) => {
            if(typeof el === 'string') {
              return el.toLowerCase().includes(querySt.toLowerCase());
            } else {
              return JSON.stringify(el).toLowerCase().includes(querySt.toLowerCase());
            }
          });
        }

        // If the value is a number, check if it matches directly
        if (typeof value === 'number') {
          return value.toString().includes(querySt);
        }

        return false;  // If none of the conditions are met, return false
      });
    });

    return filtered;
  }

}


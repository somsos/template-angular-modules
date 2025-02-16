import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { IUserDto } from "../../commons/IUserDto";
import { UsersDao } from "../UsersDao";
import { MockUsersBackendUtils } from "../../../../0common/utils/MockUsersBackendUtils";
import { StringUtils } from "../../../../0common";

const keyStoreU = 'users';
const storeString = localStorage.getItem(keyStoreU)!;

@Injectable()
class MockUsersBackendImpl implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    try {
      return this._handleRoute(req, next);
    } catch (error) {
      return MockUsersBackendUtils.castError(error);
    }
  }

  private _handleRoute(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = req;
    switch (true) {

      case url == UsersDao.endPoints.get("getAll")!.url && method === 'GET':
        return this._getAll();

      case url == UsersDao.endPoints.get("save")!.url && method === 'POST':
        return this._save(body, headers);

      case StringUtils.compareUrls(UsersDao.endPoints.get("deleteById")!.url, url) && method === 'DELETE':
        return this._deleteById(url, headers);

      default:
        // pass through any requests not handled above
        return next.handle(req);
    }
  }

  private _getAll(): Observable<HttpResponse<IUserDto>> {
    return MockUsersBackendUtils.ok(allUsers);
  }

  private _save(newP: IUserDto, headers: HttpHeaders): Observable<HttpResponse<IUserDto>> {
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    MockUsersBackendUtils.addEntity(keyStoreU, newP, allUsers);
    return MockUsersBackendUtils.ok(newP);
  }

  private _deleteById(url: string, headers: HttpHeaders): Observable<HttpEvent<any>> {
    console.log('deleteById');
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    const id = MockUsersBackendUtils.getPathId(url);
    const toDelete = MockUsersBackendUtils.deleteById(keyStoreU, id, allUsers);
    return MockUsersBackendUtils.ok(toDelete);
  }

  public static generateMockData(): IUserDto[] {
    return [
      { id: 1, name: "Mario", lastName: "Marquez", active: true, pictureId: 1, createdAt: new Date('2024-02-14') },
      { id: 2, name: "Luigi", lastName: "Bianchi", active: true, pictureId: 2, createdAt: new Date('2024-05-20') },
      { id: 3, name: "Peach", lastName: "Toadstool", active: false, pictureId: 3, createdAt: new Date('2024-08-15') },
      { id: 4, name: "Yoshi", lastName: "Green", active: true, pictureId: 4, createdAt: new Date('2024-11-10') },
      { id: 5, name: "Toad", lastName: "Mushroom", active: false, pictureId: 5, createdAt: new Date('2024-01-05') },
      { id: 6, name: "Bowser", lastName: "Koopa", active: true, pictureId: 6, createdAt: new Date('2024-03-25') },
      { id: 7, name: "Daisy", lastName: "Sarasaland", active: true, pictureId: 7, createdAt: new Date('2024-06-30') },
      { id: 8, name: "Wario", lastName: "Ware", active: false, pictureId: 8, createdAt: new Date('2024-09-05') },
      { id: 9, name: "Waluigi", lastName: "Pinball", active: true, pictureId: 9, createdAt: new Date('2024-12-20') },
      { id: 10, name: "Rosalina", lastName: "Galaxy", active: true, pictureId: 10, createdAt: new Date('2024-04-15') },
      { id: 13, name: "Shy Guy", lastName: "Mask", active: true, pictureId: 13, createdAt: new Date('2024-02-28') },
    ]
  }
}

let allUsers: IUserDto[] = JSON.parse(storeString) || MockUsersBackendImpl.generateMockData();

export const MockUsersBackend = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockUsersBackendImpl,
  multi: true
}

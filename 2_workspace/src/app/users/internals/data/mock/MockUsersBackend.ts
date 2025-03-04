import { HttpRequest, HttpEvent, HttpResponse, HttpHeaders, HttpHandlerFn } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";
import { IUserDto } from "../../commons/IUserDto";
import { UsersDao } from "../UsersDao";
import { MockUsersBackendUtils } from "../../../../0common/utils/MockBackendUtils";
import { AppError, StringUtils } from "../../../../0common";
import { UsersImagesStore } from "./UsersImagesStore";

const keyStoreU = 'users';
const storeString = localStorage.getItem(keyStoreU)!;

export class MockUsersBackendImpl {

  intercept(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    try {
      return this._handleRoute(req, next);
    } catch (error) {
      return MockUsersBackendUtils.castError(error);
    }
  }

  private _handleRoute(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = req;
    switch (true) {

      case url == UsersDao.endPoints.get("getAll")!.url && method === 'GET':
        return this._getAll();

      case url == UsersDao.endPoints.get("save")!.url && method === 'POST':
        return this._save(body, headers);

      case StringUtils.compareUrls(UsersDao.endPoints.get("deleteById")!.url, url) && method === 'DELETE':
        return this._deleteById(url, headers);

      case StringUtils.compareUrls(UsersDao.endPoints.get("getById")!.url, url) && method === 'GET':
        return this._getById(url);

      case StringUtils.compareUrls(UsersDao.endPoints.get("update")!.url, url) && method === 'PUT':
        return this._update(url, body, headers);

        case StringUtils.compareUrls(UsersDao.endPoints.get("uploadImage")!.url, url) && method === 'POST':
          return this._uploadFile(req);

      default:
        // pass through any requests not handled above
        return next(req) //.handle(req);
    }
  }

  private _getAll(): Observable<HttpResponse<IUserDto>> {
    return MockUsersBackendUtils.ok(allUsers);
  }

  private _getById(url: string): Observable<HttpEvent<any>> {
    const id = MockUsersBackendUtils.getPathId(url);
    const found = allUsers.find(u => u.id === id);
    if (!found) {
      const msg = "Usuario no encontrado";
      return MockUsersBackendUtils.notFoundError(msg);
    }
    return MockUsersBackendUtils.ok(found);

  }

  private _save(newP: IUserDto, headers: HttpHeaders): Observable<HttpResponse<IUserDto>> {
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    newP.pictureFile = null;
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

  private _update(url: string, body: any, headers: HttpHeaders): Observable<HttpEvent<any>> {
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    const newInfo = body as IUserDto;
    const id = MockUsersBackendUtils.getPathId(url);
    newInfo.pictureFile = null;
    const updated = MockUsersBackendUtils.updateEntity(keyStoreU, newInfo, allUsers);
    return MockUsersBackendUtils.ok(updated);
  }

  private _uploadFile(req: HttpRequest<any>): Observable<HttpEvent<any>> {
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(req.headers);
    const picture = (req.body as FormData).get("picture") as File | null;
    if(!picture) {
      throw new AppError("picture not found");
    }
    const idUser = StringUtils.getIdsFromPath(req.url)[0];
    return UsersImagesStore.saveFileOrThrow(idUser, picture)
      .pipe(switchMap(id => {
      return MockUsersBackendUtils.ok(id);
    }));
  }

  public static generateMockData(): Partial<IUserDto>[] {
    return [
      { id: 1, username:  "mario1", name: "Mario", lastName: "Marquez", active: true, pictureId: 1, createdAt: new Date('2024-02-14'), roles: [ {id: 1, authority: "Users"}, {id: 2, authority: "Products"} ] },
      { id: 2, username:  "luigi", name: "Luigi", lastName: "Bianchi", active: true, pictureId: 2, createdAt: new Date('2024-05-20'), roles: [ {id: 1, authority: "Users"} ] },
      { id: 3, username:  "peach", name: "Peach", lastName: "Toadstool", active: false, pictureId: 3, createdAt: new Date('2024-08-15'), roles: [ {id: 2, authority: "Products"} ] },
      { id: 4, username:  "yoshi", name: "Yoshi", lastName: "Green", active: true, pictureId: 4, createdAt: new Date('2024-11-10'), roles: [ {id: 2, authority: "Products"} ] },
      { id: 5, username:  "toad", name: "Toad", lastName: "Mushroom", active: false, pictureId: 5, createdAt: new Date('2024-01-05'), roles: [] },
      { id: 6, username:  "bowser", name: "Bowser", lastName: "Koopa", active: true, pictureId: 6, createdAt: new Date('2024-03-25'), roles: [] },
      { id: 7, username:  "daisy", name: "Daisy", lastName: "Sarasaland", active: true, pictureId: 7, createdAt: new Date('2024-06-30'), roles: [] },
      { id: 8, username:  "wario", name: "Wario", lastName: "Ware", active: false, pictureId: 8, createdAt: new Date('2024-09-05'), roles: [] },
      { id: 9, username:  "waluigi", name: "Waluigi", lastName: "Pinball", active: true, pictureId: 9, createdAt: new Date('2024-12-20'), roles: [] },
      { id: 10, username: "rosalina", name: "Rosalina", lastName: "Galaxy", active: true, pictureId: 10, createdAt: new Date('2024-04-15'), roles: [] },
      { id: 13, username: "shyMan", name: "ShyMan", lastName: "Mask", active: true, pictureId: 13, createdAt: new Date('2024-02-28'), roles: [] },
    ]
  }
}

let allUsers: IUserDto[] = JSON.parse(storeString) || MockUsersBackendImpl.generateMockData();


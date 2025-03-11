import { HttpRequest, HttpEvent, HttpResponse, HttpHeaders, HttpHandlerFn } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";
import { IUserDto } from "../../commons/IUserDto";
import { UsersDao } from "../UsersDao";
import { MockUsersBackendUtils } from "../../../../0common/utils/MockBackendUtils";
import { AppError, Entity, IPagePayload, IPageResponse, PageUtils, StringUtils } from "../../../../0common";
import { UsersImagesStore } from "./UsersImagesStore";

const keyStoreU = 'users';
const storeString = localStorage.getItem(keyStoreU)!;

export class MockUsersBackendImpl {

  intercept(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    if(req.url.includes("/products")) {
      return next(req);
    }

    try {
      return this._handleRoute(req, next);
    } catch (error) {
      return MockUsersBackendUtils.castError(error);
    }
  }

  private _handleRoute(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = req;

    switch (true) {

      case url == UsersDao.endPoints.get("findPage")!.url && method === 'GET':
        return this._findPage(body);

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

      case url.startsWith(UsersDao.endPoints.get("filterOverAll")!.url) && method === 'GET':
        return this._filterOverAll(url);

      default:
        // pass through any requests not handled above
        return next(req) //.handle(req);
    }
  }

  private _findPage(payload: unknown): Observable<HttpEvent<IPageResponse<Entity>>> {
    console.debug("request, mock", payload);
    const payloadCasted = payload as IPagePayload;
    const page = MockUsersBackendUtils.buildPage(allUsers, payloadCasted);
    return MockUsersBackendUtils.ok(page);
  }

  private _getAll(): Observable<HttpResponse<IUserDto>> {
    console.debug("request, mock, getAll");
    return MockUsersBackendUtils.ok(allUsers);
  }

  private _getById(url: string): Observable<HttpEvent<any>> {
    console.debug("request, mock, getById", url);
    const id = MockUsersBackendUtils.getPathId(url);
    const found = allUsers.find(u => u.id === id);
    if (!found) {
      const msg = "Usuario no encontrado";
      return MockUsersBackendUtils.notFoundError(msg);
    }
    return MockUsersBackendUtils.ok(found);

  }

  private _save(newP: IUserDto, headers: HttpHeaders): Observable<HttpResponse<IUserDto>> {
    console.debug("request, mock, save", newP, headers);
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    newP.pictureFile = null;
    MockUsersBackendUtils.addEntity(keyStoreU, newP, allUsers);
    return MockUsersBackendUtils.ok(newP);
  }

  private _deleteById(url: string, headers: HttpHeaders): Observable<HttpEvent<any>> {
    console.debug("request, mock, deleteById", url, headers);
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    const id = MockUsersBackendUtils.getPathId(url);
    const toDelete = MockUsersBackendUtils.deleteById(keyStoreU, id, allUsers);
    return MockUsersBackendUtils.ok(toDelete);
  }

  private _update(url: string, body: any, headers: HttpHeaders): Observable<HttpEvent<any>> {
    console.debug("request, mock, _update", url, body, headers);
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
    console.debug("request, mock, uploadFile", req.url, picture?.name);
    if(!picture) {
      throw new AppError("picture not found");
    }
    const idUser = StringUtils.getIdsFromPath(req.url)[0];
    return UsersImagesStore.saveFileOrThrow(idUser, picture)
      .pipe(switchMap(id => {
      return MockUsersBackendUtils.ok(id);
    }));
  }

  private _filterOverAll(url: string): Observable<HttpEvent<IPageResponse<Entity>>> {
    console.debug("request, mock, filterOverAll", url);
    const params = MockUsersBackendUtils.getUrlParams(url);
    const querySt = params.get("q");
    if(querySt == undefined || querySt == '') {
      return MockUsersBackendUtils.error("'q' url-param expected");
    }
    const filterOn = ['id', 'username', 'roles', 'createdAt'];
    const usersFiltered = MockUsersBackendUtils.overallFilter(allUsers, querySt, filterOn);
    const page = PageUtils.fromFiltering(usersFiltered);
    return MockUsersBackendUtils.ok(page);
  }

  public static generateMockData(): IUserDto[] {
    return [
      { id: 1,  username: "mario1",  active: true,   pictureId: 1,  createdAt: new Date('2024-01-14 12:30:58'),  updatedAt: new Date('2024-08-01 17:30:01'), roles: [{ id: 1, authority: "Users" }, { id: 2, authority: "Products" }], password: "" },
      { id: 2,  username: "luigi",   active: true,   pictureId: 2,  createdAt: new Date('2024-01-14 13:30:58'),  updatedAt: new Date('2024-01-14 13:30:58'), roles: [ {id: 1, authority: "Users"} ], password: "",},
      { id: 3,  username: "peach",   active: false,  pictureId: 3,  createdAt: new Date('2024-01-14 13:31:58'),  updatedAt: new Date('2024-01-14 13:31:58'), roles: [ {id: 2, authority: "Products"} ], password: "",},
      { id: 4,  username: "yoshi",   active: true,   pictureId: 4,  createdAt: new Date('2024-04-14 12:30:58'),  updatedAt: new Date('2024-04-14 12:30:58'), roles: [ {id: 2, authority: "Products"} ], password: "",},
      { id: 5,  username: "toad",    active: false,  pictureId: 5,  createdAt: new Date('2024-05-14 12:30:58'),  updatedAt: new Date('2024-05-14 12:30:58'), roles: [], password: "",},
      { id: 6,  username: "bowser",  active: true,   pictureId: 6,  createdAt: new Date('2024-06-14 12:30:58'),  updatedAt: new Date('2024-06-14 12:30:58'), roles: [], password: "",},
      { id: 7,  username: "daisy",   active: true,   pictureId: 7,  createdAt: new Date('2024-07-14 12:30:58'),  updatedAt: new Date('2024-07-14 12:30:58'), roles: [], password: "",},
      { id: 8,  username: "wario",   active: false,  pictureId: 8,  createdAt: new Date('2024-08-01 12:30:41'),  updatedAt: new Date('2024-08-01 12:30:41'), roles: [], password: "",},
      { id: 9,  username: "waluigi", active: true,   pictureId: 9,  createdAt: new Date('2024-08-01 12:30:43'),  updatedAt: new Date('2024-08-01 12:30:43'), roles: [], password: "",},
      { id: 10, username: "rosalin", active: true,   pictureId: 10, createdAt: new Date('2024-08-01 12:30:42'),  updatedAt: new Date('2024-08-01 12:30:42'), roles: [{ id: 1, authority: "Users" }, { id: 2, authority: "Products" }], password: "",},
    ]
  }
}

let allUsers: IUserDto[] = JSON.parse(storeString) || MockUsersBackendImpl.generateMockData();


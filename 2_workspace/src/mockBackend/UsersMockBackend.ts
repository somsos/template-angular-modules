import { HttpRequest, HttpEvent, HttpResponse, HttpHeaders, HttpHandlerFn } from "@angular/common/http";
import { Observable, switchMap } from "rxjs";
import { IUserDto } from "../app/users/internals/commons/IUserDto";
import { UsersDao } from "../app/users/internals/data/UsersDao";
import { MockUsersBackendUtils } from "../app/0common/utils/MockBackendUtils";
import { AppError, Entity, IPagePayload, IPageResponse, PageUtils, StringUtils } from "../app/0common";
import { UsersImagesStore } from "./UsersImagesStore";

export class UsersMockBackend {

  private static readonly keyStoreU = 'usersStore';
  private static readonly storeString = localStorage.getItem(UsersMockBackend.keyStoreU)!;
  private static readonly allUsers: IUserDto[] = JSON.parse(UsersMockBackend.storeString) || UsersMockBackend.generateMockData();

  constructor() {
    this._createUsersIfNotExists();
  }

  private _createUsersIfNotExists() {
    if (!localStorage.getItem(UsersMockBackend.keyStoreU)) {
      localStorage.setItem(UsersMockBackend.keyStoreU, JSON.stringify(UsersMockBackend.allUsers));
    }
  }

  getAllUsers(): IUserDto[] {
    return UsersMockBackend.allUsers;
  }

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
    const page = MockUsersBackendUtils.buildPage(this.getAllUsers(), payloadCasted);
    return MockUsersBackendUtils.ok(page);
  }

  private _getAll(): Observable<HttpResponse<IUserDto>> {
    console.debug("request, mock, getAll");
    return MockUsersBackendUtils.ok(this.getAllUsers());
  }

  private _getById(url: string): Observable<HttpEvent<any>> {
    console.debug("request, mock, getById", url);
    const id = MockUsersBackendUtils.getPathId(url);
    const found = this.getAllUsers().find(u => u.id === id);
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
    MockUsersBackendUtils.addEntity(UsersMockBackend.keyStoreU, newP, this.getAllUsers());
    return MockUsersBackendUtils.ok(newP);
  }

  private _deleteById(url: string, headers: HttpHeaders): Observable<HttpEvent<any>> {
    console.debug("request, mock, deleteById", url, headers);
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    const id = MockUsersBackendUtils.getPathId(url);
    const toDelete = MockUsersBackendUtils.deleteById(UsersMockBackend.keyStoreU, id, this.getAllUsers());
    return MockUsersBackendUtils.ok(toDelete);
  }

  private _update(url: string, body: any, headers: HttpHeaders): Observable<HttpEvent<any>> {
    console.debug("request, mock, _update", url, body, headers);
    MockUsersBackendUtils.mustBeAuthenticatedOrThrow(headers);
    const newInfo = body as IUserDto;
    const id = MockUsersBackendUtils.getPathId(url);
    newInfo.pictureFile = null;
    const updated = MockUsersBackendUtils.updateEntity(UsersMockBackend.keyStoreU, newInfo, this.getAllUsers());
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
    const usersFiltered = MockUsersBackendUtils.overallFilter(this.getAllUsers(), querySt, filterOn);
    const page = PageUtils.fromFiltering(usersFiltered);
    return MockUsersBackendUtils.ok(page);
  }

  public static generateMockData(): IUserDto[] {
    return [
      { id: 1,  username: "mario1",  password: 'mario1p',   token: 'token-mario1', active: true,   pictureId: 1,  createdAt: new Date('2024-01-14 12:30:58'),  updatedAt: new Date('2024-08-01 17:30:01'), roles: [{ id: 1, authority: "users" }, { id: 2, authority: "products" }]},
      { id: 2,  username: "luigi",   password: 'luigi1p',   token: 'token-luigi', active: true,   pictureId: 2,  createdAt: new Date('2024-01-14 13:30:58'),  updatedAt: new Date('2024-01-14 13:30:58'), roles: [ {id: 1, authority: "users"} ]},
      { id: 3,  username: "peach",   password: 'peach1p',   token: 'token-peach', active: false,  pictureId: 3,  createdAt: new Date('2024-01-14 13:31:58'),  updatedAt: new Date('2024-01-14 13:31:58'), roles: [ {id: 2, authority: "products"} ]},
      { id: 4,  username: "yoshi",   password: 'yoshi1p',   token: 'token-yoshi', active: true,   pictureId: 4,  createdAt: new Date('2024-04-14 12:30:58'),  updatedAt: new Date('2024-04-14 12:30:58'), roles: [ {id: 2, authority: "products"} ]},
      { id: 5,  username: "toad",    password: 'toad1p',   token: 'token-toad', active: false,  pictureId: 5,  createdAt: new Date('2024-05-14 12:30:58'),  updatedAt: new Date('2024-05-14 12:30:58'), roles: []},
      { id: 6,  username: "bowser",  password: 'bowser1p',   token: 'token-bowser', active: true,   pictureId: 6,  createdAt: new Date('2024-06-14 12:30:58'),  updatedAt: new Date('2024-06-14 12:30:58'), roles: []},
      { id: 7,  username: "daisy",   password: 'daisy1p',   token: 'token-daisy', active: true,   pictureId: 7,  createdAt: new Date('2024-07-14 12:30:58'),  updatedAt: new Date('2024-07-14 12:30:58'), roles: []},
      { id: 8,  username: "wario",   password: 'wario1p',   token: 'token-wario', active: false,  pictureId: 8,  createdAt: new Date('2024-08-01 12:30:41'),  updatedAt: new Date('2024-08-01 12:30:41'), roles: []},
      { id: 9,  username: "waluigi", password: 'waluigi1p',   token: 'token-waluigi', active: true,   pictureId: 9,  createdAt: new Date('2024-08-01 12:30:43'),  updatedAt: new Date('2024-08-01 12:30:43'), roles: []},
      { id: 10, username: "rosalin", password: 'rosalin1p',   token: 'token-rosalin', active: true,   pictureId: 10, createdAt: new Date('2024-08-01 12:30:42'),  updatedAt: new Date('2024-08-01 12:30:42'), roles: [{ id: 1, authority: "users" }, { id: 2, authority: "products" }]},
    ]
  }
}





const aa = new UsersMockBackend();

export function UsersMockBackendInterceptor(req: HttpRequest<any>, next: HttpHandlerFn ): Observable<HttpEvent<unknown>> {
  return aa.intercept(req, next);
}

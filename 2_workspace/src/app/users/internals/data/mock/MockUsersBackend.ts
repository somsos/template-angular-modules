import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HTTP_INTERCEPTORS, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { delay, Observable, of } from "rxjs";
import { IUserDto } from "../../commons/IUserDto";
import { UsersDao } from "../UsersDao";

const keyStore = 'users';
const defaultData: IUserDto[] = [
  { id: 1, name: "Mario", lastName: "Marquez", active: true, pictureId: 1, createdAt: new Date() }
]
const storeString = localStorage.getItem(keyStore)!;
let allUsers: IUserDto[] = JSON.parse(storeString) || defaultData;

@Injectable()
class MockUsersBackendImpl implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const { url, method, headers, body } = req;
    return handleRoute();

    function handleRoute() {
        switch (true) {
          case url == UsersDao.endPoints.get("getAll")!.url && method === 'GET':
            return getAll();

          default:
            // pass through any requests not handled above
            return next.handle(req);
        }
      }

    function getAll(): Observable<HttpResponse<IUserDto>> {
      console.log("geting all users");
      return ok(allUsers);
    }

    // ------ Utils --------

  function ok(body?: any): Observable<HttpResponse<any>> {
    const resp = of(new HttpResponse({ status: 200, body })); // delay observable to simulate server api call
    return resp;
  }

  }





}

export const MockUsersBackend = {
  provide: HTTP_INTERCEPTORS,
  useClass: MockUsersBackendImpl,
  multi: true
}

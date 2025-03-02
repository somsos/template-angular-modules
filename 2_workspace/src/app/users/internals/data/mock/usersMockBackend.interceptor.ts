import { HttpRequest, HttpHandlerFn, HttpEvent } from "@angular/common/http";
import { Observable } from "rxjs";
import { MockUsersBackendImpl } from "./MockUsersBackend";

const aa = new MockUsersBackendImpl();

export function usersMockBackendInterceptor(req: HttpRequest<any>, next: HttpHandlerFn ): Observable<HttpEvent<unknown>> {
  return aa.intercept(req, next);
}

import { HttpRequest } from "@angular/common/http";

export abstract class AuthUtils {

  public static addAuth(req: HttpRequest<unknown>): HttpRequest<unknown> {
    const token = "foo-token";
    const reqWToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return reqWToken;
  }

}

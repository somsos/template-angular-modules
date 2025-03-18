import { HttpRequest } from "@angular/common/http";

export abstract class AuthUtils {

  public static addAuth(req: HttpRequest<unknown>, jwt: string): HttpRequest<unknown> {
    const reqWToken = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${jwt}`),
    });
    return reqWToken;
  }

}

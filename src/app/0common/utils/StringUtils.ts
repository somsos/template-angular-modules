import { from, Observable } from 'rxjs';
import { MockUsersBackendUtils } from '../../../mockBackend/MockBackendUtils';
import { AppError } from '../0helpers/errors';

export abstract class StringUtils {
  public static randomString(length: number): string {
    const characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let result = '';
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
  }

  public static randomStringRange(min: number, max: number): string {
    const randomInRange = Math.floor(Math.random() * max) + min;
    const randomString = StringUtils.randomString(randomInRange);
    return randomString;
  }

  public static toNumber(st: string): number {
    const cast = Number(st);
    if (isNaN(cast)) {
      const msg = `string "${st}" can not be transformed to number`;
      throw new AppError(msg);
    }
    return cast;
  }

  static reduceParams(url: string): string {
    let queryStarter = url.indexOf('?');
    if (queryStarter == -1) {
      queryStarter = url.length;
    }

    const noQueryParams = url.substring(0, queryStarter);
    const reduced = noQueryParams.replace(/\/\d+/g, '/:1');
    const queryParamsReduced =
      reduced + url.substring(queryStarter, url.length);
    const urlParamsReduced = StringUtils.remplaceUrlParam(
      queryParamsReduced,
      '1'
    );
    return urlParamsReduced;
  }

  static remplaceUrlParam(url: string, remplace: string) {
    return url.replace(/\${([^}]+)}/g, remplace);
  }

  static replaceUrlVariablesValues(url: string, remplace: string): string {
    return url.replace(/\d+/g, () => remplace);
  }

  static compareUrls(route: string, requestedUrl: string): boolean {
    if(route === requestedUrl) {
      return true
    }

    const sameBySimplification = StringUtils._bySimplification(route, requestedUrl);
    if(sameBySimplification) {
      return true;
    }


    const routePattern = route
      .replace(/\${([^}]+)}/g, '([^/]+)')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${routePattern}(\\?.*)?$`);

    try {
      MockUsersBackendUtils.getPathId(requestedUrl);
    } catch (error) {
      const routeSimple = StringUtils.remplaceUrlParam(route, "1");
      const requestedUrlSimple =  StringUtils.replaceUrlVariablesValues(requestedUrl, "1");
      const same = routeSimple == requestedUrlSimple;
      return same
    }

    return regex.test(requestedUrl);
  }

  private static _bySimplification(route: string, requestedUrl: string): boolean {
    const regexMatchDomain = /^.*\/\/[^\/]+/;
    const regexMatchPathVariable = /\/[0-9]{1,}\//g;
    const simpleRoute = route
      .replace(regexMatchDomain, '')
      .replaceAll("${id}", "1")
    ;
    const simpleUrlRequested = requestedUrl
      .replace(regexMatchDomain, '')
      .replaceAll(regexMatchPathVariable, "/1/")
    ;

    const same = simpleRoute == simpleUrlRequested;
    return same;
  }

  static toUrlBase64(file: File): Observable<string> {
    const imgProm = new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
    });

    return from(imgProm);
  }

  static getIdsFromPath(path: string): number[] {
    const regex = /\/(\d+)/g;
    const ids: number[] = [];
    let match;
    while ((match = regex.exec(path)) !== null) {
      ids.push(parseInt(match[1]));
    }
    return ids;
  }

}

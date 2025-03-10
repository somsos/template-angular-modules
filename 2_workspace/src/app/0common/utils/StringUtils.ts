import { from, Observable } from 'rxjs';
import { AppError } from '../errors/externals/AppError';
import { Endpoint } from '../types/Endpoint';
import { MockUsersBackendUtils } from './MockBackendUtils';

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

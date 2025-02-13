import { AppError } from '../errors/externals/AppError';
import { Endpoint } from '../types/Endpoint';

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

  static compareUrls(route: string, requestedUrl: string): boolean {
    const routePattern = route
      .replace(/\${([^}]+)}/g, '([^/]+)')
      .replace(/\//g, '\\/');
    const regex = new RegExp(`^${routePattern}(\\?.*)?$`);
    return regex.test(requestedUrl);
  }
}
